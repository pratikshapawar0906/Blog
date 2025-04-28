import React from "react";

const BlogPage = () => {
  const stories = [
    {
      author: "tanisha massey",
      date: "27 Sep",
      title: "The Brightest Stars in the Darkest Sky",
      description: "New Zealand's Dark Sky Project at Lake Tekapo",
      category: "Travel",
      likes: 1,
      image: "sky.jpg", // Replace with actual image URL
    },
    {
      author: "tanisha massey",
      date: "27 Sep",
      title: "The Food and Environment in Costa Rica Healed My Gut and My Soul",
      description: "I didn’t know I was in for a week of wellness",
      category: "Food",
      likes: 1,
      image: "food.jpg", // Replace with actual image URL
    },
    {
      author: "tanisha massey",
      date: "27 Sep",
      title: "I'm Not Afraid — Let's Say I'm Aware",
      description: "Traveling always gives this woman food for thought",
      category: "Travel",
      likes: 0,
      image: "travel.jpg", // Replace with actual image URL
    },
  ];

  const trending = [
    "The Brightest Stars in the Darkest Sky",
    "What Is Apple's Vision Pro Really For?",
    "Change These 12 iOS 17 Settings Right Now",
    "The Food and Environment in Costa Rica Healed My Gut and My Soul",
  ];

  const categories = [
    "Programming",
    "Hollywood",
    "Film Making",
    "Social Media",
    "Cooking",
    "Technology",
    "Finances",
    "Travel",
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Main Content */}
        <div className="col-md-8">
          {stories.map((story, index) => (
            <div key={index} className="card mb-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>{story.author}</span>
                  <span>{story.date}</span>
                </div>
                <h5 className="card-title">{story.title}</h5>
                <p className="card-text">{story.description}</p>
                <div className="d-flex align-items-center">
                  <span className="badge bg-primary me-2">{story.category}</span>
                  <span className="text-muted">❤️ {story.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          {/* Categories */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Stories from all interests</h5>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <span key={index} className="badge bg-secondary me-2 mb-2">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trending */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Trending</h5>
              <ol className="list-group list-group-numbered">
                {trending.map((item, index) => (
                  <li key={index} className="list-group-item">
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
