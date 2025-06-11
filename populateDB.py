from faker import Faker
from faker.providers import BaseProvider
from datetime import datetime, timedelta
import random

# No longer works because of updated schema!

# Script to populate database with the new schema
# Usage:
# 1. Adjust the numbers in the main() section as needed.
# 2. Run this script to generate a SQL file with INSERT statements.
# 3. Execute the SQL file in your MySQL database.

fake = Faker()

# Custom provider for Portuguese postal codes
class customProvider(BaseProvider):
    def pt_postal_code(self):
        first_part = str(random.randint(1000, 9999))
        second_part = str(random.randint(100, 999))
        return int(f"{first_part}{second_part}")  # store as integer

fake.add_provider(customProvider)

# Collections of statements
energy_type_statements = []
postal_code_statements = []
supplier_statements = []
user_statements = []
housing_statements = []
equipment_statements = []
consumption_statements = []
production_statements = []
given_statements = []
notification_statements = []
widget_statements = []

inserted_cps = set()

# Write all SQL statements to file in the correct order
def save_sql_file(filename="populateDB_new_schema.sql"):
    with open(filename, "w", encoding="utf-8") as file:
        file.write(f"-- Generated on {datetime.now()}\n")
        # Order matters due to FKs
        for stmt in energy_type_statements:
            file.write(stmt + "\n")
        for stmt in postal_code_statements:
            file.write(stmt + "\n")
        for stmt in supplier_statements:
            file.write(stmt + "\n")
        for stmt in user_statements:
            file.write(stmt + "\n")
        for stmt in housing_statements:
            file.write(stmt + "\n")
        for stmt in equipment_statements:
            file.write(stmt + "\n")
        for stmt in consumption_statements:
            file.write(stmt + "\n")
        for stmt in production_statements:
            file.write(stmt + "\n")
        for stmt in given_statements:
            file.write(stmt + "\n")
        for stmt in notification_statements:
            file.write(stmt + "\n")
        for stmt in widget_statements:
            file.write(stmt + "\n")

# 1. Populate energy_types (static list)
def populate_energy_types():
    types = ["Solar Photovoltaic", "Solar Thermal", "Biomass", "Wind", "Geothermal"]
    for name in types:
        energy_type_statements.append(
            f"INSERT INTO energy_types (name) VALUES ('{name}');"
        )

# 2. Populate postal_codes when generating housings
def populate_postal_codes(cps):
    for cp in cps:
        if cp not in inserted_cps:
            # Simple mapping based on prefix
            prefix = int(str(cp)[:4])
            if 1000 <= prefix < 2000:
                loc = "Lisboa"
            elif 2000 <= prefix < 2400:
                loc = "Santarém"
            elif 2400 <= prefix < 2900:
                loc = "Leiria"
            elif 2900 <= prefix < 3000:
                loc = "Setúbal"
            elif 3000 <= prefix < 4000:
                loc = "Coimbra"
            elif 4000 <= prefix < 5000:
                loc = "Porto"
            else:
                loc = "Desconhecido"
            postal_code_statements.append(
                f"INSERT INTO postal_codes (pc, location) VALUES ({cp}, '{loc}');"
            )
            inserted_cps.add(cp)

# 3. Populate suppliers
def populate_suppliers(num_suppliers=5):
    for _ in range(num_suppliers):
        enterprise = fake.company().replace("'", "''")
        cost = round(random.uniform(0.05, 0.30), 4)
        supplier_statements.append(
            f"INSERT INTO suppliers (enterprise, cost_kWh) VALUES ('{enterprise}', {cost});"
        )

# 4. Populate users
def populate_users(num_users=10):
    for _ in range(num_users):
        name = fake.name().replace("'", "''")
        email = fake.email()
        password = fake.password(length=10)
        admin = random.choice([0, 1])
        user_statements.append(
            f"INSERT INTO users (email, name, password, admin) VALUES ('{email}', '{name}', '{password}', {admin});"
        )

# 5. Populate housings
def populate_housings(num_housings=10, num_users=10):
    for i in range(1, num_housings+1):
        address = fake.address().replace("'", "''")
        cp = fake.pt_postal_code()
        populate_postal_codes([cp])
        btype = random.choice(['Apartamento', 'Moradia', 'Estúdio'])
        user_id = random.randint(1, num_users)
        housing_statements.append(
            f"INSERT INTO housings (address, pc, building_type, id_user) VALUES ('{address}', {cp}, '{btype}', {user_id});"
        )

# 6. Populate energy_equipments
def populate_equipments(num_housings=10, max_energy_type=5):
    for i in range(1, num_housings+1):
        num_eq = random.randint(1, 3)
        for _ in range(num_eq):
            e_type = random.randint(1, max_energy_type)
            cap = random.randint(1, 50)
            name = fake.word().capitalize()
            equipment_statements.append(
                f"INSERT INTO energy_equipments (energy_type, capacity, housing, name) VALUES ({e_type}, {cap}, {i}, '{name}');"
            )

# 7. Populate energy_consumptions
def populate_consumptions(num_housings=10, num_suppliers=5, per_housing=5):
    for i in range(1, num_housings+1):
        dt = datetime.now()
        for _ in range(per_housing):
            dt += timedelta(hours=1)
            val = round(random.uniform(1.0, 20.0), 2)
            supp = random.randint(1, num_suppliers)
            consumption_statements.append(
                f"INSERT INTO energy_consumptions (value, date, id_supplier, id_housing) VALUES ({val}, '{dt}', {supp}, {i});"
            )

# 8. Populate energy_productions
def populate_productions(max_equipment_id, per_equipment=5):
    for eq_id in range(1, max_equipment_id+1):
        dt = datetime.now()
        for _ in range(per_equipment):
            dt += timedelta(hours=1)
            val = round(random.uniform(0.5, 15.0), 2)
            production_statements.append(
                f"INSERT INTO energy_productions (id_equipment, value, date) VALUES ({eq_id}, {val}, '{dt}');"
            )

# 9. Populate given_energies
def populate_given_energies(max_equipment_id, per_equipment=3):
    for eq_id in range(1, max_equipment_id+1):
        dt = datetime.now()
        for _ in range(per_equipment):
            dt += timedelta(hours=1)
            val = round(random.uniform(0.1, 10.0), 2)
            given_statements.append(
                f"INSERT INTO given_energies (value, id_equipment, date) VALUES ({val}, {eq_id}, '{dt}');"
            )

# 10. Populate notifications
def populate_notifications(num_notifications=10, max_user=10, max_consumption=50):
    types = ['alert', 'info', 'warning']
    for _ in range(num_notifications):
        t = random.choice(types)
        u = random.randint(1, max_user)
        c = random.randint(1, max_consumption)
        msg = fake.sentence().replace("'", "''")
        notification_statements.append(
            f"INSERT INTO notifications (type, id_user, id_consumption, message) VALUES ('{t}', {u}, {c}, '{msg}');"
        )

# 11. Populate widgets
def populate_widgets(per_user=2, max_user=10):
    for uid in range(1, max_user+1):
        for _ in range(per_user):
            title = fake.word().capitalize()
            body = fake.sentence().replace("'", "''")
            wtype = fake.word()
            widget_statements.append(
                f"INSERT INTO widgets (id_user, title, body, type) VALUES ({uid}, '{title}', '{body}', '{wtype}');"
            )

# Main invocation
if __name__ == "__main__":
    # Configuration
    NUM_SUPPLIERS = 1
    NUM_USERS = 1
    NUM_HOUSINGS = 1
    PER_HOUSING_CONSUMPTIONS = 1
    PER_EQUIP_PRODUCTIONS = 1
    PER_EQUIP_GIVEN = 1
    NUM_NOTIFICATIONS = 1
    WIDGETS_PER_USER = 1

    # Populate all tables
    populate_energy_types()
    # populate_suppliers(NUM_SUPPLIERS)
    populate_users(NUM_USERS)
    populate_housings(NUM_HOUSINGS, NUM_USERS)
    populate_equipments(NUM_HOUSINGS, len(energy_type_statements))
    populate_consumptions(NUM_HOUSINGS, NUM_SUPPLIERS, PER_HOUSING_CONSUMPTIONS)
    # Estimate total equipment rows for productions and given
    total_eq = len(equipment_statements)
    populate_productions(total_eq, PER_EQUIP_PRODUCTIONS)
    populate_given_energies(total_eq, PER_EQUIP_GIVEN)
    # Estimate total consumptions for notifications
    total_cons = len(consumption_statements)
    populate_notifications(NUM_NOTIFICATIONS, NUM_USERS, total_cons)
    populate_widgets(WIDGETS_PER_USER, NUM_USERS)

    # Write to SQL file
    save_sql_file()
    print("SQL file 'populateDB_new_schema.sql' has been generated.")
