import React, { useState } from 'react';
import {Button, } from '@mui/material';
import '../../App.css';

interface NewItemProps {
  onAdd: (item: { commentTitle: string; commentDescription: string }) => void;
}

const NewComment: React.FC<NewItemProps> = ({ onAdd }) => {
    const [commentTitle, setCommentTitle] = useState('');
    const [commentDescription, setCommentDescription] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd({ commentTitle, commentDescription });
  };

  return (
    <form  onSubmit={handleSubmit} >
      
      <div className ='comment-input'>
        <div className='comment-input-item'>
            <label >Tittle</label>
            <input type='text' value={commentTitle} onChange={(e)=>setCommentTitle(e.target.value)}   
            placeholder='Input your comment tittle'/>
            </div>
        
        <div className='comment-input-item'>
            <label >Description</label>
            <input type='text' value={commentDescription}  onChange={(e)=>setCommentDescription(e.target.value)}  
            placeholder='Input your comment description' />
          </div>
          <div className='comment-input-item'>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Comment</Button>
        </div>
        </div>
      </form>
      
      
    
  )
};
export default NewComment;