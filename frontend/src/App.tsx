// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

export default function App() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [books, setBooks] = useState([]);
  const [outputMessage, setOutputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    try {
      const response = await fetch("http://localhost:3000/Books");
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
      setBooks([]);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setOutputMessage("");

    try {
      const response = await fetch("http://localhost:3000/AddBook", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result === true) {
        setOutputMessage("✅ Book added successfully");
        reset(); // 提交后清空表单
        await loadBooks();
      } else {
        setOutputMessage("❌ Failed to add book");
      }
    } catch (e) {
      console.log(e);
      setOutputMessage("⚠️ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <div className="badge">📚 Mini Library</div>
          <h1>Book Manager</h1>
          <p className="subtitle">
            Add a book and see the updated list instantly.
          </p>
        </header>

        <div className="grid">
          {/* LEFT: FORM CARD */}
          <section className="card">
            <div className="cardHeader">
              <h2>Add a Book</h2>
              <p className="muted">Please fill in all required fields.</p>
            </div>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="field">
                <label>Book Title</label>
                <input
                  placeholder="e.g., Clean Code"
                  {...register("BookTitle", { required: true, maxLength: 50 })}
                />
                {errors.BookTitle && (
                  <span className="error">Please enter a Title (max 50)</span>
                )}
              </div>

              <div className="field">
                <label>Genre</label>
                <input
                  placeholder="e.g., Programming"
                  {...register("Genre", { required: true, maxLength: 20 })}
                />
                {errors.Genre && (
                  <span className="error">Please enter a Genre (max 20)</span>
                )}
              </div>

              <div className="field">
                <label>Author</label>
                <input
                  placeholder="e.g., Robert C. Martin"
                  {...register("Author", { required: true, maxLength: 50 })}
                />
                {errors.Author && (
                  <span className="error">Please enter an Author (max 50)</span>
                )}
              </div>

              <div className="field">
                <label>Date Published</label>
                <input
                  placeholder="YYYY-MM-DD"
                  {...register("DataPublished", {
                    required: true,
                    maxLength: 10,
                    pattern: /^\d{4}-\d{2}-\d{2}$/,
                  })}
                />
                {errors.DataPublished && (
                  <span className="error">Use YYYY-MM-DD format</span>
                )}
              </div>

              <div className="actions">
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Submit"}
                </button>
                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => {
                    reset();
                    setOutputMessage("");
                  }}
                >
                  Clear
                </button>
              </div>

              {outputMessage && (
                <div
                  className={
                    outputMessage.includes("✅")
                      ? "notice success"
                      : outputMessage.includes("⚠️")
                      ? "notice warn"
                      : "notice error"
                  }
                >
                  {outputMessage}
                </div>
              )}
            </form>
          </section>

          {/* RIGHT: TABLE CARD */}
          <section className="card">
            <div className="cardHeader row">
              <div>
                <h2>Current Books</h2>
                <p className="muted">
                  Total: <strong>{books.length}</strong>
                </p>
              </div>

              <button className="btn small secondary" onClick={loadBooks} type="button">
                Refresh
              </button>
            </div>

            {books.length === 0 ? (
              <div className="empty">
                <div className="emptyIcon">📭</div>
                <div>
                  <div className="emptyTitle">No books found</div>
                  <div className="muted">Add your first book on the left.</div>
                </div>
              </div>
            ) : (
              <div className="tableWrap">
                <table className="bookTable">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Genre</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((b, index) => (
                      <tr key={b._id ?? index}>
                        <td className="titleCell">{b.BookTitle}</td>
                        <td>{b.Author || b.author || ""}</td>
                        <td>{b.Genre}</td>
                        <td>{b.DataPublished}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <footer className="footer muted">
          Built with React + react-hook-form + Fetch API
        </footer>
      </div>
    </div>
  );
}
