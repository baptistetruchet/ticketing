const Landing = ({ currentUser }) => {
  return (
    <div className="container">
      <h1>{currentUser ? "You are signed in" : "You are NOT signed in"}</h1>
    </div>
  );
};

export default Landing;
