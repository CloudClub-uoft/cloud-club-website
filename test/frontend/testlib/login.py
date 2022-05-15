from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def login():
    import os
    from dotenv import load_dotenv
    load_dotenv()
    PORT = os.getenv("PORT")

    driver = webdriver.Chrome()
    driver.implicitly_wait(3)

    email = "test.account@gmail.com"
    password = "TestAccount1@"

    driver.get(f"http://localhost:{PORT}/login?r=/")

    email_entry = driver.find_element(By.NAME, "email")
    password_entry = driver.find_element(By.NAME, "password")
    email_entry.send_keys(email)
    password_entry.send_keys(password)

    submit_button = driver.find_element(By.CLASS_NAME, "btn")
    submit_button.click()

    return driver