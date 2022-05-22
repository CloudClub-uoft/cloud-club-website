from xml.dom import NotFoundErr
from selenium import webdriver
import selenium
from selenium.webdriver.common.by import By

import sys
sys.path.append('../testlib')
from register import *
from teardown import *

def test_register():
    driver = register()
    try:
        driver.find_element(By.XPATH, "//div[contains(text(), 'you may now login.')]")
        print("test register passed.")
        teardown(driver)
    except selenium.common.exceptions.NoSuchElementException as e:
        print(e)
        teardown(driver)
        raise Exception("Did not obtain success message 'you may now login.' upon registration")

if __name__ == '__main__':
    test_register()