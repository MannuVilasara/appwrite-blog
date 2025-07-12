import React from "react";
import { AuthLayout, PostForm } from "../components";

const AddPost: React.FC = () => {
  return (
    <AuthLayout authentication={true}>
      <PostForm />
    </AuthLayout>
  );
};

export default AddPost;
