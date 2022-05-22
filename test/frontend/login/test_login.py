from xml.dom import NotFoundErr
from selenium import webdriver
import selenium
from selenium.webdriver.common.by import By

import sys
sys.path.append('../testlib')
from register import *
from teardown import *

def test_login():
    email = "test.account@gmail.com"
    password = "TestAccount1@"
    driver = login(email, password)
    try:
        driver.find_element(By.XPATH, "//div[contains(text(), 'Login Successful!')]")
        print("test login passed.")
        teardown(driver)
    except selenium.common.exceptions.NoSuchElementException as e:
        print(e)
        teardown(driver)
        raise Exception("Did not obtain success message 'Login Successful!' upon login")

if __name__ == '__main__':
    test_login()