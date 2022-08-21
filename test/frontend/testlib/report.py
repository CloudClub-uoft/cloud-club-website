from xml.dom import NotFoundErr
from selenium import webdriver
import selenium
from selenium.webdriver.common.by import By
import time


def fill_out_report_form(driver, report):
    driver.find_element(By.ID, "reportButton").click()
    driver.find_element(By.ID, "comment").send_keys(report)
    driver.find_element(By.ID, "report-btn").click()


def report(driver):
    report = "Test Report Message"
    fill_out_report_form(driver, report)
    return driver
