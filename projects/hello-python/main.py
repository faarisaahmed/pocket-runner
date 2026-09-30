import platform
import sys

print(f"Hello from Python {sys.version.split()[0]} on {platform.system() or 'browser'}")
squares = [i * i for i in range(10)]
print("squares:", squares)
print("sum:", sum(squares))
