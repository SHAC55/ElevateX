// src/components/CertificateTest.jsx
import React, { useEffect, useState } from 'react';
import {
  getCertificateTest,
  submitCertificateTest,
} from '../api/career';

const CertificateTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getCertificateTest();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load test.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmit = async () => {
    try {
      const res = await submitCertificateTest({ answers, questions });
      console.log("📊 Result from server:", res);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError('Failed to submit test.');
    }
  };

  if (loading) return <p>Loading test...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!questions.length) return <p>No test available.</p>;

  if (result) {
    const score = result?.certificate?.score ?? 0;
    const passed = score >= 70;
    const certificateUrl = result?.certificate?.certificateUrl;

    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Test Result</h2>
        <p>Score: {score}%</p>
        <p>Status: {passed ? '✅ Passed' : '❌ Failed'}</p>

        {passed && certificateUrl && (
         <div className="mt-4">
  <a
   href={`http://localhost:5000${certificateUrl}`}
    download // ✅ This tells the browser to download the file
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-600 text-white px-4 py-2 rounded-md"
  >
    Download Certificate
  </a>
</div>

        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Certification Test</h2>

      {questions.map((q) => (
        <div key={q.id} className="mb-6">
          <p className="font-medium">{q.question}</p>
          <div className="mt-2 space-y-2">
            {q.options.map((opt, idx) => (
              <label key={idx} className="block">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleOptionChange(q.id, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
      >
        Submit Test
      </button>
    </div>
  );
};

export default CertificateTest;
