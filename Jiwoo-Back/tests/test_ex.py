import unittest
import sys
from io import StringIO
import os
# sys.path에 프로젝트의 루트 디렉토리를 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

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
