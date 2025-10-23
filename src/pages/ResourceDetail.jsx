import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import resourcesData from "../data/resources.json";

export default function ResourceDetail() {
  const { slug } = useParams();
  const resource = resourcesData.find((r) => r.slug === slug);

  const handleDownloadPDF = () => {
    if (!resource) return;

    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.text(resource.title, 20, y);
    y += 10;

    // Category
    doc.setFontSize(12);
    doc.text(`Category: ${resource.category}`, 20, y);
    y += 10;

    // Sections
    resource.sections.forEach((section, idx) => {
      y += 10;
      doc.setFontSize(14);
      doc.text(`${section.heading || "Section " + (idx + 1)}`, 20, y);
      y += 8;

      doc.setFontSize(11);

      // Split text into multiple lines if too long
      const lines = doc.splitTextToSize(section.text || "", 170);
      lines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += 6;
      });
    });

    doc.save(`${resource.slug}.pdf`);
  };

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg text-gray-400">
          ❌ Resource not found for slug: {slug}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-4">{resource.title}</h1>

        {/* Category */}
        <span className="inline-block text-sm font-semibold text-orange-400 mb-6">
          {resource.category}
        </span>

        {/* Download Button */}
        <div className="mb-8">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 transition text-sm font-semibold"
          >
            📥 Download as PDF
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {resource.sections &&
            resource.sections.map((section, idx) => (
              <div key={idx}>
                {section.heading && (
                  <h2 className="text-2xl font-bold text-orange-400 mb-3">
                    {section.heading}
                  </h2>
                )}

                {section.text && (
                  <div className="text-gray-300 leading-relaxed [&_a]:text-orange-400 [&_a:hover]:underline">
                    <ReactMarkdown>{section.text}</ReactMarkdown>
                  </div>
                )}

                {section.list && (
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.image && (
                  <img
                    src={section.image}
                    alt={section.heading || "Resource illustration"}
                    className="rounded-lg shadow-lg mt-4"
                  />
                )}
              </div>
            ))}
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link
            to="/resources"
            className="text-gray-400 hover:text-orange-400 transition"
          >
            ← Back to Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
