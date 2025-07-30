# Fix projection data to show 25cm increase from 2024 to 2050

# Read the current file and remove the old projection data
with open('public/compiled_sea_level_rise_data.csv', 'r', encoding='utf-8') as file:
    lines = file.readlines()

# Find where the projection data starts (2025,000000)
projection_start = None
for i, line in enumerate(lines):
    if line.startswith('2025,000000'):
        projection_start = i
        break

if projection_start is not None:
    # Keep only the satellite data (up to 2024)
    satellite_data = lines[:projection_start]
    
    # Calculate new projection values
    # 2024 average is around 72mm, target 2050 is 72 + 250 = 322mm
    # Over 26 years (2025-2050), that's 250mm / 26 = ~9.6mm per year
    
    base_2024 = 72.0  # Approximate 2024 average
    target_2050 = base_2024 + 250.0  # 25cm = 250mm
    annual_increase = (target_2050 - base_2024) / 26  # 26 years from 2025 to 2050
    
    # Generate new projection data
    new_projections = []
    for i in range(26):  # 2025 to 2050
        year = 2025 + i
        value = base_2024 + (annual_increase * (i + 1))
        year_str = f'{year:.6f}'.replace('.', ',')
        value_str = f'{value:.1f}'.replace('.', ',')
        new_projections.append(f'{year_str};{value_str}\n')
    
    # Write the corrected file
    with open('public/compiled_sea_level_rise_data.csv', 'w', encoding='utf-8') as file:
        file.writelines(satellite_data)
        file.writelines(new_projections)
    
    print(f'Fixed projection data:')
    print(f'2024 baseline: ~{base_2024:.1f}mm')
    print(f'2050 target: {target_2050:.1f}mm')
    print(f'Total increase: {target_2050 - base_2024:.1f}mm = 25cm')
    print(f'Annual increase: {annual_increase:.1f}mm per year')
    print(f'First projection (2025): {base_2024 + annual_increase:.1f}mm')
    print(f'Last projection (2050): {target_2050:.1f}mm')
else:
    print('Could not find projection data start point') 