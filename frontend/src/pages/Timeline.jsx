import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import CompanyCard from '../components/CompanyCard.jsx';
const Timeline = () => {
    const [companies, setCompanies] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/companies`, {
                    withCredentials: true
                });
                setCompanies(data.data)
                console.log(data);
            } catch (err) {
                console.log("Timeline fething error", err);
                toast.error("Error while fetching companies details");
            }
        }

        fetchData();
    }, [])
    return (
        <div className='flex flex-col gap-3 mt-3'>
            {companies.map((company) => (
                <CompanyCard key={company._id} company={company} />
            ))}
        </div>
    )
}

export default Timeline