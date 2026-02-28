"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";


const SubTaskDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  return (
    <div>page</div>
  )
}

export default SubTaskDetailPage