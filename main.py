from flask import Flask, render_template, request, url_for, redirect, jsonify
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv


# Global values
limit_value = 4

load_dotenv()

APP_SECRET_KEY = os.environ.get('APP_SECRET_KEY')
DATABASE_URI = os.environ.get('DATABASE_URL1')

app = Flask(__name__)
app.config['SECRET_KEY'] = APP_SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

Bootstrap(app)
db = SQLAlchemy(app)


class Spods(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), nullable=False)
    img_url = db.Column(db.String())
    episode = db.Column(db.String())
    description = db.Column(db.String())
    date_added = db.Column(db.String())


# db.create_all()


# Add items to database

# db.session.add_all([
#     Spods(title="The year in review, what's new in design",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30e76d90ff5f8327971c6_Group%2022.png",
#           description="100% the right move, but twice I later realized that I was too in my head, too blinded by what I wanted or by what was wrong",
#           date_added="December 21, 2022",
#           episode="E18"),
#     Spods(title="Abuse of dark pattern, a real threat",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30dd417dbbd7877759916_Group%2019.png",
#           description="No a death sentence, but dark patterns are very important to avoid. And here is why",
#           date_added="December 19, 2021",
#           episode="E15"),
#     Spods(title="Designing in a 3d virtual environment, what promise",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30e094ac6ca7d5ba18ea8_Group%2020.png",
#           description="While these two questions may seem worlds apart, I have found that they share the same approach to getting you",
#           date_added="December 15, 2023",
#           episode="E16"),
#     Spods(title="Acts that do not match, and spines that do not connect",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30d0c4ac6ca3c7ea18900_Group%2016.png",
#           description="I was so certain I knew what leadership was thinking that I gave up and quit or almost quit.",
#           date_added="December 10, 2022",
#           episode="E12"),
#     Spods(title="Thinking design, and design thinking, well enough.",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30d482afcc011f24f515d_Group%2017.png",
#           description="Process are imprtant, so they make things even more complex, yes, the design thinking process it is.",
#           date_added="November 3, 2022",
#           episode="E13"),
#     Spods(title="NoCode and Low code design projects that will blow your mind",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30d8e3ed5bc026a301ff9_Group%2018.png",
#           description="Extremely satisfying, the masses are producing software, what's the issue at hand?",
#           date_added="October 30, 2022",
#           episode="E14"),
#     Spods(title="A blank page, what a misery to the beginner",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30aa70c1b9744b30ccd9a_Group%208.png",
#           description="Sometimes that was 100% the right move, but twice I later realized that I was too in my head, too blinded by what I wanted.",
#           date_added="October 30, 2021",
#           episode="E04"),
#     Spods(title="The amazing design people list",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e309919ea04b9f65745b50_Group%205.png",
#           description="Every week I have three 30-minute free mentoring sessions on Amazing Design People List. I love doing it to help people, and it keeps me connected to what is going on globally in the creative community.",
#           date_added="October 20, 2022",
#           episode="E01"),
#     Spods(title="Bend your pixels, it's more satisfying",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e309fa760c8940c7aa1528_Group%206.png",
#           description="While trying to get promoted or deciding if you should quit your job are at very different stages in your career journey, they share the need for clarity, action, and a way to understand the way forward.",
#           date_added="October 10, 2022",
#           episode="E02"),
#     Spods(title="Yoda wasn't proud of the Jedi. But Luke was different",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30a4c5880677c2afb3295_Group%207.png",
#           description="When you are in either of these positions, the biggest thing I have found you need, and often the hardest to come by, is perspective.",
#           date_added="October 29, 2022",
#           episode="E03"),
#     Spods(title="Pattern madness, and how to create a loop",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30b1f0c1b9733a80cd253_Group%209.png",
#           description="Learn the art of misery, from the dark lord. It's easier than you imagined it would be",
#           date_added="October 23, 2022",
#           episode="E05"),
#     Spods(title="The laws of not a good designer Radical UX",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30b575e4dc3404f9bccf1_Group%2010.png",
#           description=" How can I decide if I should quit my job and find something new? And I have worked at my job for X years",
#           date_added="June 30, 2022",
#           episode="E06"),
#     Spods(title="Button and the act of teleportation on 2d interfaces",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30bb29aa6a30e3654a672_Group%2011.png",
#           description=" How can I decide if I should quit my job and find something new? And I have worked at my job for X years",
#           date_added="July 30, 2022",
#           episode="E07"),
#     Spods(title="Its too spicy, why we don't like gradients",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30c834971c205e6696429_Group%2014.png",
#           description="It's the modern design age, and gradients are like achetypes of misery, we hate them so much, we don't know how to spell them",
#           date_added="October 02, 2022",
#           episode="E10"),
#     Spods(title="Rachet and Clank - what did we learn from their friendship",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30c2e4a5f1b608d1ecf69_Group%2013.png",
#           description="Many times in my coaching session I point this out to and often surprise people to help them see.",
#           date_added="March 30, 2022",
#           episode="E09"),
#     Spods(title="Love and curves - modals and modules",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30c0b9aa6a37fd754ab51_Group%2012.png",
#           description=" How can I decide if I should quit my job and find something new? And I have worked at my job for X years",
#           date_added="March 20, 2022",
#           episode="E08"),
#     Spods(title="A nomad and a remotard, and their ideas in the mud",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30cf62ec9510411f6f601_Group%2015.png",
#           description="When we decided not to go back to the office, we made or way to Jakarta to find a nomad and a remotard, still struggling what the differences are.",
#           date_added="March 10, 2022",
#           episode="E11"),
#     Spods(title="Toxic work environment and how to roast the rodents",
#           img_url="https://assets.website-files.com/62e308e90c1b9773190cb378/62e30e4a17dbbddcf775a0d1_Group%2021.png",
#           description="Before we get into how I have found success in these moments, if you are at a company that is abusive or toxic",
#           date_added="March 30, 2022",
#           episode="E17"),
# ]
# )

# db.session.commit()

def format_result(result):
    """formats result into a dictionary"""
    return {
        "id": result.id,
        "title": result.title,
        "img_url": result.img_url,
        "episode": result.episode,
        "description": result.description,
        "date_added": result.date_added
    }


@app.route('/')
def home():
    episodes = Spods.query.order_by('id').limit(limit_value).all()
    carousel_episodes = Spods.query.order_by('id').all()
    return render_template("index.html", episodes=episodes, carousel_episodes=carousel_episodes)


@app.route('/load-home-data')
def load_home_data():
    episodes = Spods.query.order_by('id').all()
    result_list = [format_result(item) for item in episodes]
    carousel_episodes = Spods.query.order_by('id').all()
    carousel_episodes_list = [format_result(
        item) for item in carousel_episodes]
    return {"podcasts": result_list, "carousel_episodes": carousel_episodes_list}


@app.route('/podcast/<int:podcast_id>')
def get_podcast(podcast_id):
    """takes podcast id to query database"""
    episode_to_play = Spods.query.get(podcast_id)
    return render_template('podcast.html', episode=episode_to_play)


@app.route('/search', methods=['GET'])
def search_podcast():
    """takes the search keyword and queries the title and description of the database if keyword is in either"""
    search_text = request.args.get('podcast')
    # it queries the title and description for the search keyword.
    if search_text != "":
        result = Spods.query.filter(db.or_(Spods.title.ilike(
            f"%{search_text}%"), Spods.description.ilike(f"%{search_text}%"))).all()

    else:
        result = Spods.query.order_by("id").all()
    print(len(result))
    result_list = [format_result(item) for item in result]
    return {"podcasts": result_list}


@app.route('/sort-podcasts')
def sort_podcast():
    """sorts podcasts in descending order according to id"""
    sort_category = request.args.get('sort_by')
    if sort_category == "newest":
        result = Spods.query.order_by(Spods.id.desc()).all()
    else:
        result = Spods.query.order_by(Spods.id.asc()).all()
    result_list = [format_result(item) for item in result]
    return {"podcasts": result_list}


if __name__ == "__main__":
    app.run(debug=True)
