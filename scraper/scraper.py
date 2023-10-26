
import requests
import bs4
import time
import webbrowser
import datetime
import re
import random
import json
from pymongo import MongoClient

client = MongoClient("mongodb+srv://dkathein:ouzJLyvx00vOItXk@calcluster.3pzjv6g.mongodb.net/?retryWrites=true&w=majority")
db = client.CMUCal

headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
}

class ResourceEvent:
    def __init__(self, weekday, date, start_time, end_time, location):
        self.weekday = weekday # int 1-7
        self.date = date # datetime.date OR None (for reoccurring events)
        self.start_time = start_time # datetime.time
        self.end_time = end_time # datetime.time
        self.location = location # string
    
    def get_json(self):
        date = self.date
        if date is not None:
            date = date.strftime('%m-%d-%Y')
        
        json = {
            "weekday": self.weekday,
            "date": date,
            "start_time": self.start_time.strftime('%I:%M%p'),
            "end_time": self.end_time.strftime('%I:%M%p'),
            "location": self.location
        }
        return json
    
    def __str__(self):
        datestr = ""
        if self.date is not None:
            datestr = f"{self.date.strftime('%m-%d-%Y')} | "
        return f"{self.weekday} | {datestr}{self.start_time.strftime('%I:%M%p')} | {self.end_time.strftime('%I:%M%p')} | {self.location}"

class Resource:
    def __init__(self, resource_type, course_id, course_name, professor, instructor, events):
        self.resource_type = resource_type # "OH", "SI", "PT", "DIT"
        self.course_id = course_id # Course ID
        self.course_name = course_name  # Course Name
        self.professor = professor # Professor
        self.instructor = instructor # Instructor
        self.events = events # Events

    def get_json(self):
        json = {
            "resource_type": self.resource_type,
            "course_id": self.course_id,
            "course_name": self.course_name,
            "professor": self.professor,
            "instructor": self.instructor,
            "events": [event.get_json() for event in self.events]
        }
        return json

    def __str__(self):
        return f"{self.resource_type}: {self.course_id} | {self.course_name}\nP: {self.professor} | I: {self.instructor}\n" + '\n'.join([str(e) for e in self.events])

class ScraperBot:
    def run(self):
        while 1:
            self.run_si_scraper()
            print("")
            self.run_drop_in_scraper()
            print("")
            self.run_pt_scraper()
            print("\nWaiting 10mins..\n")
            time.sleep(60*10)

    def run_si_scraper(self):
        print("Running SI scraper...")
        si_resources = self.scrape_si()
        si_json = [si.get_json() for si in si_resources]

        with open("si.json", "w") as outfile:
            outfile.write(json.dumps(si_json))

        db["supplemental-instruction"].delete_many({})
        result = db["supplemental-instruction"].insert_many(si_json)

        print(f"Inserted {len(result.inserted_ids)} SIs into DB.")
        #[print(resource, "\n") for resource in si_resources]
    
    def run_drop_in_scraper(self):
        print("Running Drop In Tutoring scraper...")
        drop_in_resources = self.scrape_drop_in()
        drop_in_json = [drop_in.get_json() for drop_in in drop_in_resources]
        
        with open("drop_in.json", "w") as outfile:
            outfile.write(json.dumps(drop_in_json))

        db["drop-in-tutoring"].delete_many({})
        result = db["drop-in-tutoring"].insert_many(drop_in_json)

        print(f"Inserted {len(result.inserted_ids)} DITs into DB.")
        #[print(resource, "\n") for resource in drop_in_resources]
    
    def run_pt_scraper(self):
        print("Running Peer Tutoring scraper...")
        pt_resources = self.scrape_pt()
        pt_json = [pt.get_json() for pt in pt_resources]

        with open("peer_tutoring.json", "w") as outfile:
            outfile.write(json.dumps(pt_json))

        db["peer-tutoring"].delete_many({})
        result = db["peer-tutoring"].insert_many(pt_json)

        print(f"Inserted {len(result.inserted_ids)} PTs into DB.")
        #[print(resource, "\n") for resource in pt_resources]

    def scrape_si(self):
        link = "https://www.cmu.edu/student-success/programs/supp-inst.html"
        r = requests.get(link, headers=headers)
        soup = bs4.BeautifulSoup(r.text, 'html.parser')

        table = soup.find('table', id="si-table")
        #print(table)
        
        resources = []
        for i, row in enumerate(table.find_all('tr')):
            if i != 0:
                data = row.find_all('th') + row.find_all('td')

                course_nameids = data[0].text.strip()
                courses_name_ids_parsed = re.findall(r'(\d{2}-\d{3})\s(.*?)(?=(\d{2}-\d{3})|$)', course_nameids)

                professor = data[1].text.strip()
                si_leader = data[2].text.strip()

                events = []
                for timedata in [t for t in data[3].contents if "-" in t]:
                    if timedata.startswith("("):
                        continue
                    weekday = timedata.split(" @ ")[0].rstrip("s")
                    weekday = time.strptime(weekday, "%A").tm_wday + 1
                    start_end = timedata.split(" @ ")[1].split(" - ")[0].split("-")
                    start_time = datetime.datetime.strptime(start_end[0], "%I:%M%p").time()
                    end_time = datetime.datetime.strptime(start_end[1], "%I:%M%p").time()
                    location = timedata.split(" - ")[1]
                    event = ResourceEvent(weekday, None, start_time, end_time, location)
                    events.append(event)
                
                for course in courses_name_ids_parsed:
                    course_id = course[0]
                    course_name = course[1].strip()
                    resource = Resource("SI", course_id, course_name, professor, si_leader, events)
                    resources.append(resource)
        return resources
    
    def scrape_drop_in(self):
        link = "https://www.cmu.edu/student-success/programs/tutoring.html"
        r = requests.get(link, headers=headers)
        soup = bs4.BeautifulSoup(r.text, 'html.parser')

        table = soup.find('table', id="dropintable")
        #print(table)
        
        resources = []
        for i, row in enumerate(table.find_all('tr')):
            if i != 0:
                data = row.find_all('th') + row.find_all('td')

                course_nameids = data[0].text.strip()
                courses_name_ids_parsed = re.findall(r'(\d{2}-\d{3})\s(.*?)(?=(\d{2}-\d{3})|$)', course_nameids)

                start_time = datetime.time(hour=20)
                end_time = datetime.time(hour=22)
                weekday = data[1].text.strip()
                if "(" in weekday:
                    new_time = weekday.split(" (")[1].split(")")[0].strip().split("-")
                    try:
                        start_time = datetime.datetime.strptime(new_time[0], "%I:%M%p").time()
                    except ValueError:
                        start_time = datetime.datetime.strptime(new_time[0] + "pm", "%I:%M%p").time()
                    
                    try:
                        end_time = datetime.datetime.strptime(new_time[1], "%I:%M%p").time()
                    except ValueError:
                        end_time = datetime.datetime.strptime(new_time[1] + "pm", "%I:%M%p").time()
                    
                    weekday = weekday.split(" (")[0]
                
                weekday = time.strptime(weekday.rstrip("s"), "%A").tm_wday + 1
                location = data[2].text.strip()
                tutor = data[3].text.strip()

                events = [ResourceEvent(weekday, None, start_time, end_time, location)]
                
                for course in courses_name_ids_parsed:
                    course_id = course[0]
                    course_name = course[1].strip().strip("&").strip()
                    resource = Resource("DIT", course_id, course_name, None, tutor, events)
                    resources.append(resource)
        return resources
    
    def scrape_pt(self):
        email = "dkathein@andrew.cmu.edu"
        password = "CMUCalToTheMoon"

        link = "https://cmu.mywconline.net/index.php"
        s = requests.Session()
        r = s.get(link, headers=headers)

        payload = {
            "username": "dkathein@andrew.cmu.edu",
            "password": "CMUCalToTheMoon",
            "scheduleid": "sc64da3ea4c19b9",
            "setCookie": "1",
            "submit": "login"
        }
        r = s.post(link, data=payload, headers=headers)
        soup = bs4.BeautifulSoup(r.text, 'html.parser')

        courses = soup.find('select', id="limfoc").findAll('option')[1:]
        resources = []
        for course in courses:
            link = "https://cmu.mywconline.net/" + course.get("value")
            course = course.text.strip().rstrip(" Only")
            course_id, course_name = course.split(" ", 1)
            course_id = course_id[:2] + "-" + course_id[2:]
            professor = None
            print(f"{course_id} | {course_name} | {link}")

            r = s.get(link, headers=headers)
            soup = bs4.BeautifulSoup(r.text, 'html.parser')
            days = soup.findAll("div", style="overflow-x:auto;")
            
            appt_count = 0
            instructor_events = {}
            for day in days:
                weekday = day.find("th", class_="col_first fw-normal").text.strip()
                available_appts = day.findAll("td", {"aria-label": "Open/Available Appointment Slot"})
                for appt in available_appts:
                    apptdata = appt.get("title").strip()

                    time1 = apptdata.split("reserve <strong>")[1].split("<")[0]
                    month_day_yr = apptdata.split("on <strong>")[1].split("<")[0] + ", " + str(datetime.datetime.now().year)
                    start_time = datetime.datetime.strptime(f"{month_day_yr} {time1}", "%B %d, %Y %I:%M %p")
                    end_time = start_time + datetime.timedelta(hours=1)
                    date = start_time.date()
                    weekday = start_time.weekday() + 1

                    instructor = apptdata.split("with <strong>")[1].split("<")[0]
                    
                    event = ResourceEvent(weekday, date, start_time.time(), end_time.time(), "WCOnline")
                    if instructor not in instructor_events:
                        instructor_events[instructor] = []
                    instructor_events[instructor].append(event)

                    appt_count += 1
            
            for instructor, events in instructor_events.items():
                resource = Resource("PT", course_id, course_name, professor, instructor, events)
                resources.append(resource)

            print(f"Added {appt_count} appts.")
            time.sleep(0.5)
            #if appt_count > 40:
            #    break
        
        return resources

bot = ScraperBot()
bot.run()



