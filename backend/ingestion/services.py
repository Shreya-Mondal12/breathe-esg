import pandas as pd

from ingestion.models import RawRecord, DataSource
from emissions.models import EmissionRecord
from companies.models import Company


UNIT_MAP = {
    "L": "liters",
    "LTR": "liters",
    "GAL": "gallons",
    "m3": "cubic_meter",
    "kWh": "kilowatt_hour",
    "KM": "kilometer",
}


def normalize_unit(unit):

    if not unit:
        return ""

    return UNIT_MAP.get(str(unit).strip(), unit)


# =========================================
# MAIN ROUTER
# =========================================

def process_file(file, source_type, company_id):

    if source_type == "SAP":
        return process_sap_csv(file, company_id)

    elif source_type == "UTILITY":
        return process_utility_csv(file, company_id)

    elif source_type == "TRAVEL":
        return process_travel_csv(file, company_id)

    else:
        raise ValueError("Unsupported source type")


# =========================================
# SHARED DUPLICATE CHECK
# =========================================

def check_duplicate_file(file):

    if DataSource.objects.filter(
        original_file_name=file.name
    ).exists():

        raise Exception(
            f"{file.name} already uploaded"
        )


# =========================================
# SAP INGESTION
# =========================================

def process_sap_csv(file, company_id):

    df = pd.read_csv(file)

    file.seek(0)

    company = Company.objects.get(id=company_id)

    check_duplicate_file(file)

    datasource = DataSource.objects.create(
        company=company,
        source_type="SAP",
        original_file_name=file.name,
        uploaded_file=file
    )

    created_records = []

    for _, row in df.iterrows():

        clean_row = row.fillna(0)

        raw_record = RawRecord.objects.create(
            datasource=datasource,
            raw_data=clean_row.to_dict(),
        )

        original_unit = clean_row.get("Unit", "")

        unit = normalize_unit(original_unit)

        quantity = clean_row.get("Quantity", 0)

        try:
            quantity = float(quantity)
        except Exception:
            quantity = 0

        status = determine_status(
            quantity,
            unit
        )

        emission_record = EmissionRecord.objects.create(
            company=company,
            raw_record=raw_record,
            scope="SCOPE_1",
            category="Fuel",
            activity_type=clean_row.get(
                "Fuel Type",
                "Unknown"
            ),
            quantity=quantity,
            unit=original_unit,
            normalized_unit=unit,
            review_status=status
        )

        created_records.append(
            emission_record.id
        )

    return created_records


# =========================================
# UTILITY INGESTION
# =========================================

def process_utility_csv(file, company_id):

    df = pd.read_csv(file)

    file.seek(0)

    company = Company.objects.get(id=company_id)

    check_duplicate_file(file)

    datasource = DataSource.objects.create(
        company=company,
        source_type="UTILITY",
        original_file_name=file.name,
        uploaded_file=file
    )

    created_records = []

    for _, row in df.iterrows():

        clean_row = row.fillna(0)

        raw_record = RawRecord.objects.create(
            datasource=datasource,
            raw_data=clean_row.to_dict(),
        )

        original_unit = "kWh"

        unit = normalize_unit(original_unit)

        quantity = clean_row.get("kWh", 0)

        try:
            quantity = float(quantity)
        except Exception:
            quantity = 0

        status = determine_status(
            quantity,
            unit
        )

        emission_record = EmissionRecord.objects.create(
            company=company,
            raw_record=raw_record,
            scope="SCOPE_2",
            category="Electricity",
            activity_type="Electricity Consumption",
            quantity=quantity,
            unit=original_unit,
            normalized_unit=unit,
            review_status=status
        )

        created_records.append(
            emission_record.id
        )

    return created_records


# =========================================
# TRAVEL INGESTION
# =========================================

def process_travel_csv(file, company_id):

    df = pd.read_csv(file)

    file.seek(0)

    company = Company.objects.get(id=company_id)

    check_duplicate_file(file)

    datasource = DataSource.objects.create(
        company=company,
        source_type="TRAVEL",
        original_file_name=file.name,
        uploaded_file=file
    )

    created_records = []

    for _, row in df.iterrows():

        clean_row = row.fillna(0)

        raw_record = RawRecord.objects.create(
            datasource=datasource,
            raw_data=clean_row.to_dict(),
        )

        original_unit = "KM"

        unit = normalize_unit(original_unit)

        quantity = clean_row.get("Distance", 0)

        try:
            quantity = float(quantity)
        except Exception:
            quantity = 0

        status = determine_status(
            quantity,
            unit
        )

        emission_record = EmissionRecord.objects.create(
            company=company,
            raw_record=raw_record,
            scope="SCOPE_3",
            category="Business Travel",
            activity_type=clean_row.get(
                "Travel Mode",
                "Flight"
            ),
            quantity=quantity,
            unit=original_unit,
            normalized_unit=unit,
            review_status=status
        )

        created_records.append(
            emission_record.id
        )

    return created_records


# =========================================
# SHARED VALIDATION
# =========================================

def determine_status(quantity, unit):

    status = "PENDING"

    # MISSING UNIT

    if not unit:
        status = "FAILED"

    # NEGATIVE VALUES

    if quantity < 0:
        status = "SUSPICIOUS"

    # EXTREME VALUES

    if quantity > 100000:
        status = "SUSPICIOUS"

    return status