import time
import sys
import unittest
import subprocess

from selenium import webdriver
import chromedriver_autoinstaller
from selenium.webdriver.common.by import By

from os.path import join, dirname
from dotenv import load_dotenv

sys.path.append("../testlib")
from login import *
from forum import *
from teardown import *


class TestForum(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # auto-upgrade chromedriver
        chromedriver_autoinstaller.install()
        # Load environment variables
        dotenv_path = join(dirname(__file__), "../../../.env")
        load_dotenv(dotenv_path)
        # Create sub-process
        cls.proc = subprocess.Popen("node index.js", cwd="../../../")

    @classmethod
    def tearDownClass(cls):
        # Terminate sub-process
        cls.proc.terminate()

    def test_delete_post(self):
        email = "test.account@gmail.com"
        password = "TestAccount1@"

        driver = login(email, password)
        navigate_to_forum(driver)
        total_posts_before = get_total_posts(driver)
        delete_buttons = driver.find_elements(By.ID, "pop")
        self.assertGreater(len(delete_buttons), 0, "no posts to delete!")

        delete_buttons[0].click()
        yes_button = driver.find_element(By.ID, "report-btn")
        yes_button.click()

        total_posts_after = get_total_posts(driver)

        self.assertEqual(
            total_posts_before - 1,
            total_posts_after,
            f"total posts did not decease by 1 after deletion - before: {total_posts_before}; after: {total_posts_after}",
        )
        print("test delete post passed")
        teardown(driver)

    def test_create_post(self):
        email = "test.account@gmail.com"
        password = "TestAccount1@"

        driver = login(email, password)

        navigate_to_forum(driver)
        total_posts_before = get_total_posts(driver)
        new_post = driver.find_element(By.XPATH, "//a[contains(text(), 'New Post')]")
        new_post.click()

        title = driver.find_element(By.NAME, "subject")
        title.send_keys(f"Test post from selenium timestamped {time.time()}")
        body = driver.find_element(By.NAME, "body")
        body.send_keys(f"This is the body of post. Timestamped {time.time()}")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Create')]").click()

        total_posts_after = get_total_posts(driver)

        self.assertEqual(
            total_posts_before + 1,
            total_posts_after,
            f"total posts did not increase by 1 after new post - before: {total_posts_before}; after: {total_posts_after}",
        )
        print("test create new post passed")

        teardown(driver)

    def test_sort_by_posts_titles(self):
        driver = set_forum_pagination_to_sort_by("title", 50)
        total_posts = get_total_posts(driver)
        if total_posts == 0:
            print("there are no posts to sort!")
            return
        all_posts_titles = driver.find_elements(By.XPATH, "//a/h5[@class='mb-1']")
        all_posts_titles_text = [title.text for title in all_posts_titles]
        all_posts_titles_text_sorted = sorted(all_posts_titles_text)

        self.assertEqual(
            all_posts_titles_text,
            all_posts_titles_text_sorted,
            f"Failed to sort by title!",
        )
        print("test sort by post titles passed")
        teardown(driver)

    def test_sort_by_posters_names(self):
        driver = set_forum_pagination_to_sort_by("firstname", 50)
        total_posts = get_total_posts(driver)
        if total_posts == 0:
            print("there are no posts to sort!")
            return
        all_posters_names = driver.find_elements(
            By.XPATH, "//div/small[contains(text(), 'Posted by')]"
        )
        all_posters_names_text = [name.text for name in all_posters_names]
        all_posters_names_text_sorted = sorted(all_posters_names_text)

        self.assertEqual(
            all_posters_names_text,
            all_posters_names_text_sorted,
            f"Failed to sort by poster name!",
        )
        print("test sort by poster names passed")
        teardown(driver)

    def test_sort_by_newest_post_first(self):
        driver = set_forum_pagination_to_sort_by("newest", 50)
        total_posts = get_total_posts(driver)
        if total_posts == 0:
            print("there are no posts to sort!")
            return
        all_post_dates = driver.find_elements(
            By.XPATH, "//td//small[not(contains(text(), 'Posted by'))]"
        )

        strip_name = lambda name: " ".join(name.split()[1:])
        all_poster_dates_text = [
            convert_post_date_to_yyyymmdd(strip_name(name.text))
            for name in all_post_dates
        ]
        all_poster_dates_text_sorted = sorted(all_poster_dates_text, reverse=True)

        self.assertEqual(
            all_poster_dates_text,
            all_poster_dates_text_sorted,
            "Failed to sort by newest post!",
        )
        print("test sort by newest post passed")
        teardown(driver)

    def test_sort_by_oldest_post_first(self):
        driver = set_forum_pagination_to_sort_by("oldest", 50)
        total_posts = get_total_posts(driver)
        if total_posts == 0:
            print("there are no posts to sort!")
            return
        all_post_dates = driver.find_elements(
            By.XPATH, "//td//small[not(contains(text(), 'Posted by'))]"
        )

        strip_name = lambda name: " ".join(name.split()[1:])
        all_poster_dates_text = [
            convert_post_date_to_yyyymmdd(strip_name(name.text))
            for name in all_post_dates
        ]
        all_poster_dates_text_sorted = sorted(all_poster_dates_text)

        self.assertEqual(
            all_poster_dates_text,
            all_poster_dates_text_sorted,
            "Failed to sort by oldest post!",
        )
        print("test sort by oldest post passed")
        teardown(driver)


if __name__ == "__main__":
    unittest.main()
