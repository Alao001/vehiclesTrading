import React from 'react';
import '../../App.css';
import { Comment } from '../../contracts/comments';


interface ItemProps {
  comment: Comment
  commentIdx: number
}

const CommentView: React.FC<ItemProps> = ({ comment, commentIdx,}) => (
  <div className='comment-list'>
    <div className='comment-list-item' key={commentIdx} >
      <div>
      <h3>
      {Buffer.from(comment.commentTitle, "hex").toString("utf8")}
      </h3>
      <p>
      {Buffer.from(comment.commentDescription, "hex").toString("utf8")}
      </p>
      </div>
      </div>
    </div>
    
    

     
  
     
  
);

export default CommentView;