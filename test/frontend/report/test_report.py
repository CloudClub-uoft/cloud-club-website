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
from login import *
from forum import *
from teardown import *
from report import *


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

    def test_report(cls):
        email = "test.account@gmail.com"
        password = "TestAccount1@"
        driver = login(email, password)

        navigate_to_forum(driver)
        new_post = driver.find_element(By.XPATH, "//a[contains(text(), 'New Post')]")
        new_post.click()

        title = driver.find_element(By.NAME, "subject")
        post_title = f"Test post from selenium timestamped {time.time()}"
        title.send_keys(post_title)
        body = driver.find_element(By.NAME, "body")
        body.send_keys(f"This is the body of post. Timestamped {time.time()}")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Create')]").click()
        driver.find_element(By.XPATH, f"//*[contains(text(), '{post_title}')]").click()

        report(driver)

        try:
            driver.find_element(By.XPATH, "//div[contains(text(), 'Reported!')]")
            print("test report passed.")
            teardown(driver)
        except selenium.common.exceptions.NoSuchElementException as e:
            print(e)
            teardown(driver)
            raise Exception("Did not obtain success message 'Reported!'")


if __name__ == "__main__":
    unittest.main()
