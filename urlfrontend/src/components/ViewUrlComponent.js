import React, { useEffect, useState } from 'react'
import axios from "axios"

const ViewUrlComponent= () => {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
      const fetchUrlAndSetUrl = async () => {
        const result = await axios.get("https://url-shortener-back-eta.vercel.app/all");
        setUrls(result.data);
      };
      fetchUrlAndSetUrl();
    }, []);

  return (
    <div>
      <table className="table">
        <thead className="table-dark">
          <tr>
            <th>Original Url</th>
            <th>Short Url</th>
            <th>Click Count</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url, idx) => (
            <tr key={idx}>
              <td>{url.ogUrl}</td>
              <td>
                <a href={`${url.shortURL}`}>{url.shortURL}</a>
              </td>
              <td>{url.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewUrlComponent;