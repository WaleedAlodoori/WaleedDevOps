choice = input("Convert from (C) to (F) or from (F) to (C): ").upper()

if choice == "C":
    c = float(input("Enter temperature in Celsius: "))
    print(f"{c:.1f}°C = {(c * 1.8) + 32:.1f}°F")
elif choice == "F":
    f = float(input("Enter temperature in Fahrenheit: "))
    print(f"{f:.1f}°F = {((f - 32) / 1.8):.1f}°C")
else:
    print("Invalid choice.")

