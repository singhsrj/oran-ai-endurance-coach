# Scripts

Utility and maintenance scripts for the project.

## Migration Scripts
- **run_migration.py** - Main database migration runner
- **add_workout_notes.py** - Add notes column to workouts table

## Usage

Run migration scripts from the project root:
```bash
python scripts/run_migration.py
python scripts/add_workout_notes.py
```

## Creating New Scripts

When creating new utility scripts:
1. Add them to this folder
2. Import from project root: `from app.database import ...`
3. Document the script's purpose in this README
