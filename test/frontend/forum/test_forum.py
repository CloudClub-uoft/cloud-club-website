from selenium import webdriver
from selenium.webdriver.common.by import By

import time
import os
import sys

sys.path.append('../testlib')
from login import *
from forum import *
from teardown import *

def test_delete_post():
    driver = login()

    total_posts_before = get_total_posts(driver)
    delete_buttons = driver.find_elements(By.ID, "pop")
    assert len(delete_buttons) > 0, "no posts to delete!"

    delete_buttons[0].click()
    yes_button = driver.find_element(By.ID, "report-btn")
    yes_button.click()

    total_posts_after = get_total_posts(driver)

    assert total_posts_before - 1 == total_posts_after, f"total posts did not decease by 1 after deletion - before: {total_posts_before}; after: {total_posts_after}"
    print("test delete post passed")
    
    teardown(driver)
    

def test_create_post():
    driver = login()

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
    print("test create new post passed")
    
    teardown(driver)

def test_sort_by_posts_titles():
    driver = set_forum_pagination_to_sort_by("title", 50)
    total_posts = get_total_posts(driver)
    if total_posts == 0:
        print("there are no posts to sort!")
        return
    all_posts_titles = driver.find_elements(By.XPATH, "//a/h5[@class='mb-1']")
    all_posts_titles_text = [title.text for title in all_posts_titles]
    all_posts_titles_text_sorted = sorted([title.text for title in all_posts_titles])
    assert all_posts_titles_text == all_posts_titles_text_sorted, f"Failed to sort by title!"
    print("test sort by post titles passed")

    teardown(driver)

def test_sort_by_posters_names():
    driver = set_forum_pagination_to_sort_by("firstname", 50)
    total_posts = get_total_posts(driver)
    if total_posts == 0:
        print("there are no posts to sort!")
        return
    all_posters_names = driver.find_elements(By.XPATH, "//div[@class='flex-column']/small[@class='text-muted']")
    all_posters_names_text = [name.text for name in all_posters_names]
    all_posters_names_sorted = sorted([name.text for name in all_posters_names])
    assert all_posters_names_text == all_posters_names_sorted, f"Failed to sort by poster name!"
    print("test sort by poster names passed")

    teardown(driver)

def exit_tests(driver):
    q = ""
    while q != "q":
        q = input("Finished all tests. q to quit. e to exit without quitting. ")
        if q == "q":
            teardown(driver)
        elif q == "e":
            break
        else:
            print("unrecognized command")

#test_sort_by_posts_titles()
test_sort_by_posters_names()

# navigate_to_forum(driver)
# test_create_post(driver)
# test_delete_post(driver)

# exit_tests(driver)
