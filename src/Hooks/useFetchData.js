import { useEffect, useState } from "react";

const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                setLoading(true);
                const response = await fetch(url);
                const result = await response.json();
                setData(result);
                setLoading(false);
            }catch(err){
                setError(err);
                setLoading(false);
            }
        }

        fetchData();
    }, [url]);

    return { data, loading, error };
}

export default useFetchData;