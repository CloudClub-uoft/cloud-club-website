from selenium import webdriver
from selenium.webdriver.common.by import By

import time
import os
import sys
import unittest
import subprocess
from os.path import join, dirname
from dotenv import load_dotenv

sys.path.append("../testlib")
from register import *
from forum import *
from teardown import *
from password_reset import *


class TestForum(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Load environment variables
        dotenv_path = join(dirname(__file__), "../../../.env")
        load_dotenv(dotenv_path)
        # Create sub-process
        cls.proc = subprocess.Popen("node index.js", cwd="../../../")

    @classmethod
    def tearDownClass(cls):
        # Terminate sub-process
        cls.proc.terminate()

    def test_reset(cls):
        email = os.environ.get("TEST_ACCOUNT_USERNAME")
        driver = password_reset(email)
        try:
            driver.find_element(
                By.XPATH, "//div[contains(text(), 'An email has been sent if the email address is associated with an account.')]"
            )
            print("password reset request frontend test passed.")
            teardown(driver)
        except selenium.common.exceptions.NoSuchElementException as e:
            print(e)
            teardown(driver)
            raise Exception(
                "Did not obtain success message 'Email Sent' upon password reset request"
            )


if __name__ == "__main__":
    unittest.main()
