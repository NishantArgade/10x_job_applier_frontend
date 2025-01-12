import React from 'react'
import { fetchData } from '@/lib/axios';

const page = async () => {
    const data = await fetchData('/test'); 

    return (
      <div>
        <h1>Data from Laravel API:</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
}

export default page