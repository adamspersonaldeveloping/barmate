# My Awesome Project
A full stack web application designed for bartenders. Access standard drinks, drinks submitted by other bartenders, and a discussion forum. Save drinks to your favorites list and leave comments in discussions.

**Link to project:** https://www.barmate.bar/

![barmate homepage](https://res.cloudinary.com/dllmha3wx/image/upload/v1685402698/barmate-screenshot_mmhiss.png)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, Express.js, Node.js, EJS, Cloudinary, Python

I have always had a passion for making cocktails but I struggled to find a definitive source for IBA cocktails with images and a place where bartenders could add their own drinks and have discussions together about life behind the bar. This is my answer to that struggle. All IBA cocktails are listed here, other users may sign up and add their own cocktails while keeping any they want private so that only they can see it. There is also a forum for discussing issues related to bartending. The cocktails can be sorted for easier browsing as well. I built a Python web scraper to find all of the IBA cocktails and images. I used cloudinary for image hosting and serving. 

## Optimizations
To optimize this application I would add a search function so that specific drink lookup can be even faster. I would also add a function to detect duplicate drinks, for instance if a user inputs an "old fashioned" before posting, any other "old fashioned" recipes could be pulled up and displayed to the user asking if their drink is different from the ones already submitted. Lastly, I would host the images on a faster server such as AWS so that image loading would be slightly faster, this however is out of my budget. 



## Lessons Learned:

I realized that the original path I was using to upload images to cloudinary was deprecated which is why they would not load originally. This took a few hours of searching before I realized I should look to see if the cloudinary documentation had changed, which it had. Ideally I would use the newest documentation instead of using deprecated docs. 

## Examples:
Take a look at these couple examples that I have in my own portfolio:

**Yuki's Photography:** https://www.yuhhiphotography.art/

**Expat Car Sales:** https://expatcarsaleskl.cyclic.app/

**Cello House:** https://cellohouse.com/


