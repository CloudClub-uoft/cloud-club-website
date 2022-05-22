from selenium import webdriver
from selenium.webdriver.common.by import By

import time
import sys

sys.path.append('../testlib')
from login import *

def navigate_to_forum(driver):
    forum = driver.find_element(By.XPATH, "//a[contains(text(), 'Forum')]")
    forum.click()

def make_posts(driver, n, start):
    for i in range(start, start+n):
        new_post = driver.find_element(By.XPATH, "//a[contains(text(), 'New Post')]")
        new_post.click()

        title = driver.find_element(By.NAME, "subject")
        title.send_keys(f"Post {i} from selenium")
        body = driver.find_element(By.NAME, "body")
        body.send_keys(f"This is the body of post {i}")

        driver.find_element(By.XPATH, "//button[contains(text(), 'Create')]").click()

# start with forum with 0 posts
# make one post...
# https://github.com/CloudClub-uoft/iot-backend/blob/staging/test/data_new_test.js
# before, it, after
# setup, teardown in unittest https://docs.python.org/3/library/unittest.html
def get_total_posts(driver):
    # ensure you are navigated to the forum page when calling this function.
    post_stats = driver.find_element(By.ID, "post-statistics-container").text
    if "No posts found" in post_stats:
        return 0

    split_post_stats = post_stats.split()
    return int(split_post_stats[-3]) # total posts

def test_delete_post(driver):
    total_posts_before = get_total_posts(driver)

    delete_buttons = driver.find_elements(By.ID, "pop")
    assert len(delete_buttons) > 0, "no posts to delete!"

    delete_buttons[0].click()
    yes_button = driver.find_element(By.ID, "report-btn")
    yes_button.click()

    total_posts_after = get_total_posts(driver)

    assert total_posts_before - 1 == total_posts_after, f"total posts did not decease by 1 after deletion - before: {total_posts_before}; after: {total_posts_after}"
    print("Delete post test passed")

def test_create_post(driver):
    total_posts_before = get_total_posts(driver)

    new_post = driver.find_element(By.XPATH, "//a[contains(text(), 'New Post')]")
    new_post.click()

    title = driver.find_element(By.NAME, "subject")
    title.send_keys(f"Test post from selenium timestamped {time.time()}")
    body = driver.find_element(By.NAME, "body")
    body.send_keys(f"This is the body of post. Timestamped {time.time()}")
    driver.find_element(By.XPATH, "//button[contains(text(), 'Create')]").click()

    total_posts_after = get_total_posts(driver)

    assert total_posts_before + 1 == total_posts_after, f"total posts did not increase by 1 after new post - before: {total_posts_before}; after: {total_posts_after}"
    print("Create new post test passed")


# get all texts
def test_sort_by_name(driver):
    pass

def test_sort_by_date(driver):
    pass

def get_all_posts(driver):
    driver.find_element(By.NAME, "limit").click()
    driver.find_element(By.XPATH, "//option[contains(text(), '50')]").click()
    driver.find_element(By.ID, "submit-sort").click()
    time.sleep(0.5)

    poster_names = driver.find_elements(By.XPATH, "//small[contains(text(), 'Posted by')]")
    for name in poster_names:
        print(name.text)

def exit_tests(driver):
    q = ""
    while q != "q":
        q = input("Finished all tests. q to quit. e to exit without quitting. ")
        if q == "q":
            driver.quit()
        elif q == "e":
            break
        else:
            print("unrecognized command")

driver = webdriver.Chrome()
driver.implicitly_wait(3)

login(driver)

navigate_to_forum(driver)
test_create_post(driver)
test_delete_post(driver)

exit_tests(driver)