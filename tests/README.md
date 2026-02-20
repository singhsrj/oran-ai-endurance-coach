# Tests

Test files and debugging utilities.

## Test Files
- **test_api.py** - API endpoint tests
- **test_password.py** - Password hashing tests
- **test_login.html** - Manual login page test

## Debug Files
- **debug_login.py** - Login debugging script
- **dashboard-response-example.json** - Sample dashboard response

## Running Tests

### Backend Tests
```bash
# From project root
python -m pytest tests/
```

### Manual API Testing
```bash
python tests/test_api.py
```

## Adding New Tests

Create new test files following the pattern:
- Unit tests: `test_<module>.py`
- Integration tests: `test_integration_<feature>.py`
- E2E tests: `test_e2e_<flow>.py`
