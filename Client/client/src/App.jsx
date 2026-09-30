import { useState, useEffect } from "react"
import { API_URL } from "./api.js";

function App() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    distanceMiles: "",
    difficulty: "",
    region: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function getJson(path) {
    const response = await fetch(`${API_URL}${path}`);
    if (!response.ok) throw new Error (`Failed to fetch path: ${path}`);
    return response.json();
  }

  useEffect(() => {
    async function loadData() {
      try{
        const [trailsData] = await Promise.all([
          getJson("/api/trails"),
        ]);
        setTrails(trailsData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`${API_URL}/api/trails`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          distanceMiles: parseFloat(form.distanceMiles),
          difficulty: form.difficulty,
          region: form.region,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setSubmitError(body.error || `Failed to submit form: ${response.status}`);
        return;
      }

      const createdTrail = await response.json();

      setTrails((prev) => [...prev, createdTrail]);
      setForm({
        name: "",
        distanceMiles: "",
        difficulty: "",
        region: "",
      });
    } catch (err) {
      console.error(err);
      setSubmitError("Could not submit form. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  let content;
  if (loading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p style={{ color: "red" }}>{error}</p>;
  } else if (trails.length === 0) {
    content = <p>No trails found.</p>;
  } else content = trails.map((trail) => (
    <div key={trail.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
      <h3>{trail.name}</h3>
      <p>Distance: {trail.distanceMiles} miles</p>
      <p>Difficulty: {trail.difficulty}</p>
      <p>Region: {trail.region}</p>
    </div>
  ));
   

  return (
    <>
      <h1>Trails</h1>
      <div>{content}</div>
      {!loading && !error && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <h2>Add a New Trail</h2>
          {submitError && <p style={{ color: "red" }}>{submitError}</p>}
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Distance (miles):
              <input
                type="number"
                name="distanceMiles"
                value={form.distanceMiles}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Difficulty:
              <input
                type="text"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Region:
              <input
                type="text"
                name="region"
                value={form.region}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Add Trail"}
          </button>
        </form>
      )}
    </>
  );
}
export default App
