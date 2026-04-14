import React , {useState , useEffect} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {CheckCircle2 , Circle} from 'lucide-react';
import {useAuth} from '../context/AuthContext';

const PrepCheckList = ()=>{
    const {user , updateUser} = useAuth();
    const [checkList , setCheckList] = useState(user?.prepChecklist || {});
    const [loadingKey , setLoadingKey] = useState(null);

    useEffect(() => {
        if (user?.prepChecklist) {
            setCheckList(user.prepChecklist);
        }
    }, [user]);

    const topicLabels = {
    arrays: "Arrays",
    strings: "Strings",
    twoPointers: "Two Pointers",
    slidingWindow: "Sliding Window",
    binarySearch: "Binary Search",
    dynamicProgramming: "Dynamic Programming",
    graphs: "Graphs",
    trees: "Trees",
    oop: "OOPs Concepts",
    os: "Operating Systems",
    dbms: "DBMS",
    computerNetworks: "Computer Networks",
    systemDesign: "System Design",
    aptitude: "Aptitude",
    sql: "SQL"
  };


  const totalCount = Object.keys(topicLabels).length;
  const completedCount = Object.values(checkList).filter(Boolean).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = async(key)=>{
    const newValue = !checkList[key];
    const updatedCheckList = {...checkList , [key] : newValue};
    setCheckList(updatedCheckList);
    setLoadingKey(key);

    try{
        const res = await axios.put('/api/user/checklist',{...updatedCheckList} , {withCredentials:true});

        if(res.data.success){
            updateUser(res.data.data);   
        }
    }catch(err){
        setCheckList({ ...checkList, [key]: !newValue });
        toast.error("Failed to update checklist");
    }finally{
        setLoadingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
        <div>
            <p className="text-emerald-800 font-bold text-lg">Your Preparation Progress</p>
            <p className="text-emerald-600 text-sm font-medium">{completedCount} of {totalCount} topics mastered</p>
        </div>
        <div className="text-3xl font-black text-emerald-800">{progressPercent}%</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.keys(topicLabels).map((key) => (
          <button
            key={key}
            onClick={() => handleToggle(key)}
            disabled={loadingKey === key}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
              checkList[key] 
                ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                : 'bg-white border-gray-100 hover:border-emerald-200'
            }`}
          >
            <span className={`font-semibold ${checkList[key] ? 'text-emerald-900' : 'text-gray-600'}`}>
              {topicLabels[key]}
            </span>
            
            {checkList[key] ? (
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            ) : (
              <Circle size={20} className="text-gray-300 shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PrepCheckList;