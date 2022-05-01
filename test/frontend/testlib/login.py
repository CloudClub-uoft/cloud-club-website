from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def login(driver):

    email = "test.account@gmail.com"
    password = "TestAccount1@"

    driver.get("http://localhost:4000/login?r=/")

    email_entry = driver.find_element(By.NAME, "email")
    password_entry = driver.find_element(By.NAME, "password")
    email_entry.send_keys(email)
    password_entry.send_keys(password)

    submit_button = driver.find_element(By.CLASS_NAME, "btn")
    submit_button.click()