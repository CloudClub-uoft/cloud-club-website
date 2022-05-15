from selenium import webdriver
from selenium.webdriver.common.by import By
from login import login

def set_forum_pagination_to_sort_by(sort_by: str, number_of_entries: int):
    '''
    sort_by must be one of newest, oldest, firstname, title
    number_of_entries must be one of 10, 25, 50
    '''
    driver = webdriver.Chrome()
    driver.implicitly_wait(3)

    import os
    from dotenv import load_dotenv
    load_dotenv()
    PORT = os.getenv("PORT")

    if sort_by not in ["newest", "oldest", "firstname", "title"]:
        raise TypeError("sort_by must be one of newest, oldest, firstname, title")
    if number_of_entries not in [10, 25, 50]:
        raise TypeError("number_of_entries must be one of 10, 25, 50")
    
    driver.get(f"http://localhost:{PORT}/forum?sortby={sort_by}&limit={number_of_entries}")
    return driver

def make_posts(driver, n, start):
    for i in range(start, start+n):
        new_post = driver.find_element(By.XPATH, "//a[contains(text(), 'New Post')]")
        new_post.click()

        title = driver.find_element(By.NAME, "subject")
        title.send_keys(f"Post {i} from selenium")
        body = driver.find_element(By.NAME, "body")
        body.send_keys(f"This is the body of post {i}")

        driver.find_element(By.XPATH, "//button[contains(text(), 'Create')]").click()

def navigate_to_forum(driver):
    forum = driver.find_element(By.XPATH, "//a[contains(text(), 'Forum')]")
    forum.click()

def get_total_posts(driver):
    navigate_to_forum(driver)
    post_stats = driver.find_element(By.ID, "post-statistics-container").text
    if "No posts found" in post_stats:
        return 0
    split_post_stats = post_stats.split()
    return int(split_post_stats[-3]) # total posts

def print_all_posts(driver):
    navigate_to_forum(driver)
    driver.find_element(By.NAME, "limit").click()
    driver.find_element(By.XPATH, "//option[contains(text(), '50')]").click()
    driver.find_element(By.ID, "submit-sort").click()
    time.sleep(0.5)

    poster_names = driver.find_elements(By.XPATH, "//small[contains(text(), 'Posted by')]")
    for name in poster_names:
        print(name.text)

if __name__ == '__main__':
    pass