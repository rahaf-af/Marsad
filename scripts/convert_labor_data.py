"""
Convert GASTAT "Labor Market Statistics" Excel bulletins (Arabic edition) to JSON
for the Saudi labor market dashboard.

Usage:
    pip install openpyxl
    python scripts/convert_labor_data.py raw-data/ public/data/

    raw-data/     folder with the quarterly .xlsx files downloaded from stats.gov.sa
    public/data/  output folder (created if missing)

Output:
    meta.json              labels (ar/en), list of quarters, source, methodology notes
    timeseries.json        quarterly headline rates since Q1 2021 (from the newest file)
    quarters/<YYYY-QN>.json  detailed breakdowns for one quarter

Every value block has the same shape:
    { "saudi":    { "male": n, "female": n, "total": n },
      "nonSaudi": { "male": n, "female": n, "total": n },
      "total":    { "male": n, "female": n, "total": n } }

Adding a new quarter: drop the new .xlsx into raw-data/ and run the script again.
If GASTAT renames a category, the script stops and tells you which label is unknown,
so new data never slips into the dashboard silently.
"""

import json
import re
import sys
from pathlib import Path

import openpyxl

# ---------------------------------------------------------------------------
# Label dictionaries: Arabic label in the Excel file -> id + English label
# ---------------------------------------------------------------------------

REGIONS = {
    "الرياض": ("riyadh", "Riyadh"),
    "مكة المكرمة": ("makkah", "Makkah"),
    "المدينة المنورة": ("madinah", "Madinah"),
    "القصيم": ("qassim", "Qassim"),
    "المنطقة الشرقية": ("eastern", "Eastern Province"),
    "عسير": ("asir", "Asir"),
    "تبوك": ("tabuk", "Tabuk"),
    "حائل": ("hail", "Hail"),
    "الحدود الشمالية": ("northern_borders", "Northern Borders"),
    "الحدود الشماليه": ("northern_borders", "Northern Borders"),  # spelling used in most bulletins
    "جازان": ("jazan", "Jazan"),
    "نجران": ("najran", "Najran"),
    "الباحة": ("baha", "Al Baha"),
    "الجوف": ("jouf", "Al Jouf"),
}

AGE_GROUPS = {
    "15-24": ("15_24", "15–24"),
    "25-34": ("25_34", "25–34"),
    "35-44": ("35_44", "35–44"),
    "45-54": ("45_54", "45–54"),
    "+ 55": ("55_plus", "55+"),
}
# Since Q3 2023 the wage table writes the ranges reversed ("24-15"); earlier bulletins don't.
WAGE_AGE_GROUPS = {
    **AGE_GROUPS,
    "24-15": AGE_GROUPS["15-24"],
    "34-25": AGE_GROUPS["25-34"],
    "44-35": AGE_GROUPS["35-44"],
    "54-45": AGE_GROUPS["45-54"],
    "55 +": AGE_GROUPS["+ 55"],
}
SKIPPED_AGE_ROWS = {"25-54", "54-25"}  # overlapping aggregate rows

EDUCATION = {
    "لا يوجد شهادة تعليمية": ("none", "No qualification"),
    "تعليم الطفولة المبكرة": ("early_childhood", "Early childhood education"),
    "تعليم ابتدائي": ("primary", "Primary"),
    "تعليم متوسط": ("intermediate", "Intermediate"),
    "تعليم ثانوي": ("secondary", "Secondary"),
    "دبلوم مشارك": ("associate_diploma", "Associate diploma"),
    "دبلوم متوسط": ("intermediate_diploma", "Intermediate diploma"),
    "بكالوريوس أو مايعادلها": ("bachelor", "Bachelor's or equivalent"),
    "ماجستير أو ما يعادلها": ("master", "Master's or equivalent"),
    "دكتوراه": ("doctorate", "Doctorate"),
}

OCCUPATIONS = {
    "المديرون": ("managers", "Managers"),
    "الاختصاصيون": ("professionals", "Professionals"),
    "الفنيون والاختصاصيون المساعدون": ("technicians", "Technicians and associate professionals"),
    "عاملو الدعم المكتبي": ("clerical", "Clerical support workers"),
    "عاملو الخدمات والمبيعات": ("service_sales", "Service and sales workers"),
    "العاملون المهرة في الزراعة والغابات ومزارع الأسماك": ("agriculture", "Skilled agricultural, forestry and fishery workers"),
    "عاملو الحرف ومن يرتبط بهم": ("craft", "Craft and related trades workers"),
    "مشغلو المصانع والآلات وعاملو التجميع": ("operators", "Plant and machine operators and assemblers"),
    "المهن الأولية": ("elementary", "Elementary occupations"),
    "غير مبين": ("not_stated", "Not stated"),
}

ACTIVITIES = {
    "الزراعة والحراجة وصيد الأسماك": ("agriculture", "Agriculture, forestry and fishing"),
    "التعدين واستغلال المحاجر": ("mining", "Mining and quarrying"),
    "الصناعة التحويلية": ("manufacturing", "Manufacturing"),
    "إمدادات الكهرباء والغاز والبخار وتكييف الهواء": ("electricity", "Electricity, gas, steam and air conditioning"),
    "إمدادات المياه وأنشطة الصرف الصحي وإدارة النفايات ومعالجتها": ("water", "Water supply, sewerage and waste management"),
    "التشييد": ("construction", "Construction"),
    "تجارة الجملة والتجزئة، وإصلاح المركبات ذات المحركات والدراجات النارية": ("trade", "Wholesale and retail trade"),
    "النقل والتخزين": ("transport", "Transportation and storage"),
    "أنشطة خدمات الإقامة والطعام": ("hospitality", "Accommodation and food services"),
    "المعلومات والاتصالات": ("ict", "Information and communication"),
    "الأنشطة المالية وأنشطة التأمين": ("finance", "Financial and insurance activities"),
    "الأنشطة العقارية": ("real_estate", "Real estate activities"),
    "الأنشطة المهنية والعلمية والتقنية": ("professional", "Professional, scientific and technical activities"),
    "أنشطة الخدمات الإدارية وخدمات الدعم": ("administrative", "Administrative and support services"),
    "الإدارة العامة والدفاع ، الضمان الاجتماعي الإلزامي": ("public_admin", "Public administration and defence"),
    "التعليم": ("education", "Education"),
    "الأنشطة في مجال صحة الإنسان والعمل الاجتماعي": ("health", "Human health and social work"),
    "الفنون والترفيه والتسلية": ("arts", "Arts, entertainment and recreation"),
    "أنشطة الخدمات الأخرى": ("other_services", "Other service activities"),
    "أنشطة الأسر المعيشية": ("households", "Activities of households as employers"),
    "أنشطة المنظمات والهيئات غير الخاضعة للولاية القضائية الوطنية": ("extraterritorial", "Extraterritorial organizations"),
    "غير مبين": ("not_stated", "Not stated"),
}

SECTORS = {
    "قطاع عام": ("public", "Public sector"),
    "قطاع خاص": ("private", "Private sector"),
    "اخرى": ("other", "Other"),
    "غير مبين": ("not_stated", "Not stated"),
}

WAGE_ACTIVITY_GROUPS = {
    "الزراعة": ("agriculture", "Agriculture"),
    "الصناعة": ("industry", "Industry"),
    "الخدمات": ("services", "Services"),
    "غير مبين": ("not_stated", "Not stated"),
}

TOTAL_LABELS = {"الإجمالي", "+15", "15+"}

QUARTER_WORDS = {"الأول": 1, "الاول": 1, "الثاني": 2, "الثالث": 3, "الرابع": 4}

INDICATORS = {
    "unemployment_rate": ("معدل البطالة", "Unemployment rate", "percent"),
    "employment_to_population_ratio": ("معدل المشتغلين من السكان في سن العمل", "Employment-to-population ratio", "percent"),
    "labor_force_participation_rate": ("معدل المشاركة في القوى العاملة", "Labour force participation rate", "percent"),
    "public_sector_share": ("نسبة المشتغلين في القطاع العام", "Share of employed in the public sector", "percent"),
    "private_sector_share": ("نسبة المشتغلين في القطاع الخاص", "Share of employed in the private sector", "percent"),
    "unemployment_by_age": ("معدل البطالة حسب الفئة العمرية", "Unemployment rate by age group", "percent"),
    "unemployment_by_region": ("معدل البطالة حسب المنطقة الإدارية", "Unemployment rate by region", "percent"),
    "participation_by_region": ("معدل المشاركة حسب المنطقة الإدارية", "Participation rate by region", "percent"),
    "employed_by_education": ("توزيع المشتغلين حسب المستوى التعليمي", "Employed by education level", "percent"),
    "employed_by_occupation": ("توزيع المشتغلين حسب المهنة", "Employed by occupation", "percent"),
    "employed_by_activity": ("توزيع المشتغلين حسب النشاط الاقتصادي", "Employed by economic activity", "percent"),
    "employed_by_sector": ("توزيع المشتغلين حسب القطاع", "Employed by sector", "percent"),
    "wage_by_age": ("متوسط الأجر الشهري حسب الفئة العمرية", "Average monthly wage by age group", "SAR"),
    "wage_by_activity_group": ("متوسط الأجر الشهري حسب النشاط", "Average monthly wage by activity group", "SAR"),
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def norm(text):
    """Remove Arabic diacritics/tatweel and squeeze spaces so labels compare reliably."""
    text = re.sub(r"[ً-ْـ​]", "", str(text))
    return re.sub(r"\s+", " ", text).strip()


def parse_period(text):
    """'الربع الثاني 2026' -> ('2026-Q2', 2026, 2). Tolerates GASTAT typos like 'البرع'."""
    text = norm(text)
    year = re.search(r"(20\d\d)", text)
    quarter = next((q for word, q in QUARTER_WORDS.items() if word in text.split()), None)
    if not year or not quarter:
        return None
    y = int(year.group(1))
    return f"{y}-Q{quarter}", y, quarter


def num(value, digits):
    if value is None or value == "":
        return None
    value = round(float(value), digits)
    return int(value) if digits == 0 else value


def nine_values(ws, row, first_col, digits):
    """Read the 9 standard columns: Saudi M/F/T, non-Saudi M/F/T, total M/F/T."""
    v = [num(ws.cell(row, first_col + i).value, digits) for i in range(9)]
    return {
        "saudi": {"male": v[0], "female": v[1], "total": v[2]},
        "nonSaudi": {"male": v[3], "female": v[4], "total": v[5]},
        "total": {"male": v[6], "female": v[7], "total": v[8]},
    }


def find_header(ws, start_row=1):
    """Return (row, first value column) of the first 'الذكور' header at or after start_row."""
    for r in range(start_row, ws.max_row + 1):
        for c in range(1, 15):
            if norm(ws.cell(r, c).value or "") == "الذكور":
                return r, c
    raise ValueError(f"No header row found in sheet {ws.title}")


def read_category_table(ws, mapping, digits=2, skip=()):
    """Read a 'category x nationality x gender' table into {categories:[...], total:{...}}."""
    header_row, first_col = find_header(ws)
    label_col = first_col - 1
    categories, total = [], None
    for r in range(header_row + 1, ws.max_row + 1):
        raw = ws.cell(r, label_col).value
        if raw is None or norm(raw) == "":
            break
        label = norm(raw)
        if label in skip:
            continue
        values = nine_values(ws, r, first_col, digits)
        if label in TOTAL_LABELS:
            total = values
            break
        if label not in mapping:
            raise KeyError(f"Unknown label '{label}' in sheet {ws.title}. Add it to the dictionary.")
        cat_id, en = mapping[label]
        categories.append({"id": cat_id, "values": values})
    return {"categories": categories, "total": total}


def read_time_series(ws, digits=2, start_row=1):
    """Read a 'quarter x nationality x gender' series. Stops at the first non-quarter row."""
    header_row, first_col = find_header(ws, start_row)
    rows = []
    for r in range(header_row + 1, ws.max_row + 1):
        period = parse_period(ws.cell(r, first_col - 1).value or "")
        if not period:
            break
        rows.append((period[0], nine_values(ws, r, first_col, digits)))
    return rows


def read_sector_series(ws):
    """Table 3-6-2: share of employed in public/private sector per quarter."""
    header_row, _ = find_header(ws)              # 3-6-1
    header_row, _ = find_header(ws, header_row + 1)  # 3-6-2
    # Locate the column blocks for each sector from the row two lines above the header.
    block_row = header_row - 3
    blocks = {}
    for c in range(1, ws.max_column + 1):
        label = norm(ws.cell(block_row, c).value or "")
        if label == "قطاع عام":
            blocks["public_sector_share"] = c
        elif label == "قطاع خاص":
            blocks["private_sector_share"] = c
    if len(blocks) != 2:
        raise ValueError("Could not find public/private columns in table 3-6-2")
    series = {key: [] for key in blocks}
    for r in range(header_row + 1, ws.max_row + 1):
        period = parse_period(ws.cell(r, 1).value or "")
        if not period:
            break
        for key, col in blocks.items():
            series[key].append((period[0], nine_values(ws, r, col, 2)))
    return series


def methodology_notes(ws):
    """Collect the 'data collection method' footnotes under table 2-1."""
    notes, collecting = [], False
    for r in range(1, ws.max_row + 1):
        text = norm(ws.cell(r, 1).value or "")
        if text.startswith("*أسلوب جمع البيانات"):
            collecting = True
            continue
        if collecting:
            if not text or not re.search(r"20\d\d", text):
                break
            notes.append(text)
    return notes


def file_period(wb):
    """Read the bulletin quarter from the title line of table 1."""
    ws = wb["1"]
    for r in range(1, 6):
        for c in range(1, ws.max_column + 1):
            p = parse_period(ws.cell(r, c).value or "")
            if p:
                return p
    raise ValueError("Could not detect the quarter of this file")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


# Tables are found by the words in their title, not by sheet number, because
# GASTAT renumbered the sheets over the years (e.g. Q1 2021 uses a shorter layout).
# Each entry: key -> (words that must all appear in the title, label mapping, decimals)
QUARTER_TABLES = {
    "unemployment_by_age": (["معدل البطالة", "الفئة العمرية"], AGE_GROUPS, 2),
    "unemployment_by_region": (["معدل البطالة", "المنطقة الإدارية"], REGIONS, 2),
    "participation_by_region": (["معدل المشاركة", "المنطقة الإدارية"], REGIONS, 2),
    "employed_by_education": (["التوزيع النسبي للمشتغلين", "المستوى التعليمي"], EDUCATION, 2),
    "employed_by_occupation": (["التوزيع النسبي للمشتغلين", "المهن"], OCCUPATIONS, 2),
    "employed_by_activity": (["التوزيع النسبي للمشتغلين", "النشاط الاقتصادي"], ACTIVITIES, 2),
    "employed_by_sector": (["التوزيع النسبي للمشتغلين", "القطاع"], SECTORS, 2),
    "wage_by_age": (["متوسط الأجر", "الفئة العمرية"], WAGE_AGE_GROUPS, 0),
    "wage_by_activity_group": (["متوسط الأجر", "الأنشطة الاقتصادية"], WAGE_ACTIVITY_GROUPS, 0),
}


def sheet_title(ws):
    """The table title is the first long text in the top rows that isn't the bulletin name."""
    for r in range(1, 6):
        for c in range(1, 6):
            text = norm(ws.cell(r, c).value or "")
            if len(text) > 25 and not text.startswith("إحصاءات سوق العمل"):
                return text
    return ""


def find_sheet(wb, words):
    """Return the first sheet whose title contains all words (time-series sheets excluded)."""
    for ws in wb.worksheets[1:]:
        title = sheet_title(ws)
        if all(w in title for w in words) and "سلسلة زمنية" not in title and "سلسة" not in title:
            return ws
    return None


def convert_quarter(wb):
    """Returns (data, missing_tables). A table the bulletin doesn't publish becomes null."""
    data, missing = {}, []
    for key, (words, mapping, digits) in QUARTER_TABLES.items():
        ws = find_sheet(wb, words)
        if ws is None:
            data[key] = None
            missing.append(key)
        else:
            data[key] = read_category_table(ws, mapping, digits=digits, skip=SKIPPED_AGE_ROWS)
    return data, missing


def labels(mapping):
    out = {}
    for ar, (cat_id, en) in mapping.items():
        out.setdefault(cat_id, {"ar": ar, "en": en})
    return out


def main(src, dst):
    src, dst = Path(src), Path(dst)
    files = sorted(src.glob("*.xlsx"))
    if not files:
        sys.exit(f"No .xlsx files found in {src}")

    (dst / "quarters").mkdir(parents=True, exist_ok=True)
    quarters = []
    newest = None

    for f in files:
        wb = openpyxl.load_workbook(f, data_only=True)
        period, year, q = file_period(wb)
        if any(x["period"] == period for x in quarters):
            sys.exit(f"Two files contain {period}: remove the duplicate from {src}")
        data, missing = convert_quarter(wb)
        out = {"period": period, "year": year, "quarter": q, "data": data}
        (dst / "quarters" / f"{period}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
        quarters.append({"period": period, "year": year, "quarter": q, "missingTables": missing})
        if newest is None or (year, q) > (newest[1], newest[2]):
            newest = (period, year, q, f)
        note = f"  (not published: {', '.join(missing)})" if missing else ""
        print(f"  {f.name} -> quarters/{period}.json{note}")

    # The newest bulletin carries the full history, so the time series comes from it.
    wb = openpyxl.load_workbook(newest[3], data_only=True)
    series = {
        "unemployment_rate": read_time_series(wb["2-1"]),
        "employment_to_population_ratio": read_time_series(wb["4-1"]),
        "labor_force_participation_rate": read_time_series(wb["5-1"]),
        **read_sector_series(wb["3-6"]),
    }
    periods = [p for p, _ in series["unemployment_rate"]]
    for key, rows in series.items():
        if [p for p, _ in rows] != periods:
            sys.exit(f"Time series '{key}' does not cover the same quarters as unemployment_rate")
    timeseries = [
        {
            "period": p,
            "year": int(p[:4]),
            "quarter": int(p[-1]),
            "values": {key: rows[i][1] for key, rows in series.items()},
        }
        for i, p in enumerate(periods)
    ]
    (dst / "timeseries.json").write_text(json.dumps(timeseries, ensure_ascii=False, indent=2), encoding="utf-8")

    meta = {
        "source": {
            "ar": "بيانات تقديرية من مسح القوى العاملة - الهيئة العامة للإحصاء",
            "en": "Estimates from the Labour Force Survey - General Authority for Statistics (GASTAT)",
            "url": "https://stats.gov.sa",
        },
        "latestPeriod": newest[0],
        "quarters": sorted(quarters, key=lambda x: (x["year"], x["quarter"])),
        "timeseriesRange": [periods[0], periods[-1]],
        "methodologyNotes": methodology_notes(wb["2-1"]),
        "indicators": {k: {"ar": ar, "en": en, "unit": unit} for k, (ar, en, unit) in INDICATORS.items()},
        "nationality": {
            "saudi": {"ar": "السعوديون", "en": "Saudi"},
            "nonSaudi": {"ar": "غير السعوديين", "en": "Non-Saudi"},
            "total": {"ar": "الإجمالي", "en": "Total"},
        },
        "gender": {
            "male": {"ar": "الذكور", "en": "Male"},
            "female": {"ar": "الإناث", "en": "Female"},
            "total": {"ar": "الإجمالي", "en": "Total"},
        },
        "categories": {
            "region": labels(REGIONS),
            "age": labels(AGE_GROUPS),
            "education": labels(EDUCATION),
            "occupation": labels(OCCUPATIONS),
            "activity": labels(ACTIVITIES),
            "sector": labels(SECTORS),
            "wageActivityGroup": labels(WAGE_ACTIVITY_GROUPS),
        },
    }
    (dst / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  timeseries.json: {periods[0]} to {periods[-1]} ({len(periods)} quarters)")
    print("  meta.json")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
