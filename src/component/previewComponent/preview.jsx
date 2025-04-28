import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Preview = () => {
  const { id } = useParams(); // Get draft ID from URL
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:7000/api/savedraft/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDraft(response.data.draft);
      } catch (error) {
        console.error("Error fetching draft:", error);
      }
    };

    fetchDraft();
  }, [id]);

  if (!draft) return <p>Loading...</p>;

  return (
    <div>
      <h1>Draft Preview</h1>
      <h2>{draft.title}</h2>
      <p>{draft.content}</p>
    </div>
  );
};

export default Preview;
