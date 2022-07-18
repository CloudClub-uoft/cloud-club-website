from xml.dom import NotFoundErr
from selenium import webdriver
from selenium.webdriver.common.by import By


def password_reset(email):
    import os
    from dotenv import load_dotenv

    load_dotenv()
    PORT = os.getenv("PORT")
    if not PORT:
        raise NotFoundErr(
            "Port not found. Please specify localhost port in your .env file!"
        )

    driver = webdriver.Chrome()
    driver.implicitly_wait(3)

    driver.get(f"http://localhost:{PORT}/reset?r=/")

    email_entry = driver.find_element(By.NAME, "email")
    email_entry.send_keys(email)

    submit_button = driver.find_element(By.CLASS_NAME, "btn")
    submit_button.click()

    return driver
