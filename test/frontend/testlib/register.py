from xml.dom import NotFoundErr
from selenium import webdriver
import selenium
from selenium.webdriver.common.by import By
import time

def generate_random_email():
    import random
    import string
    def random_char(char_num):
       return ''.join(random.choice(string.ascii_lowercase) for _ in range(char_num))

    return random_char(10) + "@gmail.com"

def fill_out_register_form(driver, first_name, last_name, email, password):
    driver.find_element(By.ID, "inputFirstName").send_keys(first_name)
    driver.find_element(By.ID, "inputLastName").send_keys(last_name)
    driver.find_element(By.ID, "inputEmail").send_keys(email)
    driver.find_element(By.ID, "inputPassword").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

def register():
    import os
    from dotenv import load_dotenv
    load_dotenv()
    PORT = os.getenv("PORT")
    if not PORT:
        raise NotFoundErr("Port not found. Please specify localhost port in your .env file!")

    driver = webdriver.Chrome()
    driver.implicitly_wait(3)

    driver.get(f"http://localhost:{PORT}/register?r=/")
    time.sleep(0.5)

    first_name = "Test"
    last_name = "Register"
    email = generate_random_email()
    password = "TestAccount1@"
    
    fill_out_register_form(driver, first_name, last_name, email, password)
    return driver   
