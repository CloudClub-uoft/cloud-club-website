import sys
import unittest
import subprocess
import os
from xml.dom import NotFoundErr

from selenium import webdriver
import chromedriver_autoinstaller
from selenium.webdriver.common.by import By

from os.path import join, dirname
from dotenv import load_dotenv
from sympy import Equality

sys.path.append("../testlib")
from login import *
from forum import *
from teardown import *


class TestEmailVerification(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # auto-upgrade chromedriver
        chromedriver_autoinstaller.install()
        # Load environment variables
        dotenv_path = join(dirname(__file__), "../../../.env")
        load_dotenv(dotenv_path)
        # Create sub-process
        cls.proc = subprocess.Popen("node index.js", cwd="../../../")

    @classmethod
    def tearDownClass(cls):
        # Terminate sub-process
        cls.proc.terminate()

    def test_user_cannot_verify_email_without_logging_in(self):
        load_dotenv()
        PORT = os.getenv("PORT")
        if not PORT:
            raise NotFoundErr(
                "Port not found. Please specify localhost port in your .env file!"
        )

        driver = webdriver.Chrome()
        driver.implicitly_wait(3)

        driver.get(f"http://localhost:{PORT}/")

        driver.find_element(By.CSS_SELECTOR, "a.nav-link.verifypage").click()

        try:
            driver.find_element(By.CSS_SELECTOR, "div.title h1")
            raise AssertionError("Navigated to verify page")
        except:
            print("test passed")


    def test_unverified_user_can_access_verify_email_page(self):
        email = "test.account@gmail.com"
        password = "TestAccount1@"

        driver = login(email, password)

        driver.find_element(By.CSS_SELECTOR, "a.nav-link.verifypage").click()

        self.assertEqual(
            driver.find_element(By.CSS_SELECTOR, "div.title h1").text,
            "Verify Email",
            "Test failed. Verify email page not reached"
        )

    def test_unverified_user_cannot_request_email_too_frequently(self):
        email = "test.account@gmail.com"
        password = "TestAccount1@"

        driver = login(email, password)

        driver.find_element(By.CSS_SELECTOR, "a.nav-link.verifypage").click()

        self.assertEqual(
            driver.find_element(By.CSS_SELECTOR, "div.title h1").text,
            "Verify Email",
            "Test failed. Verify email page not reached"
        )

        driver.find_element(By.CSS_SELECTOR, "input[value='Send Another Email']").click()
        driver.find_element(By.CSS_SELECTOR, "input[value='Send Another Email']").click()
        try:
            driver.find_element(By.CSS_SELECTOR, "div#message.not-successful").text
            print("test passed")
        except:
            raise AssertionError("Expected error message to display.")

if __name__ == "__main__":
    unittest.main()