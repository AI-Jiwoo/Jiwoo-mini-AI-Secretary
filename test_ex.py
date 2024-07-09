# test_ex.py
import unittest
from io import StringIO
import sys
from ex import greet

class TestGreetFunction(unittest.TestCase):
    def test_greet(self):
        # Redirect stdout to capture print statements
        captured_output = StringIO()
        sys.stdout = captured_output

        # Call the greet function
        greet()

        # Reset redirect.
        sys.stdout = sys.__stdout__

        # Assert the expected output
        self.assertEqual(captured_output.getvalue().strip(), "Hi, Jiwoo!")

if __name__ == '__main__':
    unittest.main()
