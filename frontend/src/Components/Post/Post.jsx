import { Avatar, Button, Dialog, Typography } from '@mui/material';
import React,{useState,useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addCommentOnPost, deletePost, likePost, updatePost} from "../../Actions/Post"
import {
    MoreVert,
Favorite,
FavoriteBorder,
ChatBubbleOutline,
DeleteOutline,
}
from "@mui/icons-material";
import { Link } from 'react-router-dom';
import "./Post.css";
import { getFollowingPosts, getMyPosts, loadUser } from '../../Actions/User';
import User from '../User/User';
import CommentCard from '../CommentCard/CommentCard';


const Post = ({
    postId,
    caption,
    postImage,
    likes=[],
    comments=[],   
    ownerImage,
    ownerId,
    ownerName,
    isDelete = false,
    isAccount = false
}) => {

    const [liked, setLiked] = useState(false);
    const [likesUser, setLikesUser] = useState(false);
    const[commentValue,setCommentValue]=useState("");
    const[commentToggle,setCommentToggle]=useState(false);
    const [captionValue, setCaptionValue] = useState(caption);
    const [captionToggle, setCaptionToggle] = useState(false);
    const [confirmPostDelete, setConfirmPostDelete] = useState(false);

    const {user} = useSelector(state=>state.user);
    

    const dispatch = useDispatch();
    
    const addCommentHandler = async(e)=>{
        console.log("add comment");
        e.preventDefault();
        await dispatch(addCommentOnPost(postId,commentValue));

        if (isAccount) {
            dispatch(getMyPosts());
        }
        else{
 
            dispatch(getFollowingPosts());
        }
    }
   
    const updateCaptionHandler = (e) => {
        e.preventDefault();
        dispatch(updatePost(captionValue, postId));
        dispatch(getMyPosts());
      };


      const deletePostHandler = async () => {
        await dispatch(deletePost(postId));
        dispatch(getMyPosts());
        dispatch(loadUser());
      };

      
    const handleLike= async()=>{
        setLiked(!liked);

       await dispatch(likePost(postId));

       if (isAccount) {
          dispatch(getMyPosts());
       }
       else{

           dispatch(getFollowingPosts());
       }
        alert.success("liked");
    }

    useEffect(()=>{
        likes.forEach((item)=>{
          if(item._id === user._id){
            setLiked(true);
         }
        });
      },[]);

  return (
    <div className='post'>
        <div className="postHeader">
    {isAccount? <Button onClick={() => setCaptionToggle(!captionToggle)}>
        <MoreVert/>
    </Button>: null

    }
        </div>
        <img src={postImage} alt="Post" />

        <div className="postDetails">
            <Avatar src={ownerImage} alt="User" sx={{height:"3vmax",
        width:"3vmax"}}/>

        <Link to={`/user/${ownerId}`}>
            <Typography style={{fontWeight:"700"}}>{ownerName}</Typography>
        </Link>
        <Typography      
        color="rgba(e, e, e, 0.582)"
        style={{ alignSelf: "center" , fontWeight:"100"}} >
            {caption}
        </Typography>
        </div>
        <button style={{
            border: "none",
            backgroundColor: "white",
            cursor: "pointer",
            margin: "1vmax 2vmax",
        }}
        onClick={()=>setLikesUser(!likesUser)}
        disabled= {likes.length ===0 ? true : false}

        >
            
            <Typography>{likes.length} Likes</Typography>
        </button>
        <div className="postFooter">

<Button onClick={handleLike}>
    {liked ? <Favorite style={{color:"red"}}/> : <FavoriteBorder/>}
</Button>

<Button onClick={()=>setCommentToggle(!commentToggle)}>
    <ChatBubbleOutline/>
</Button>


{isDelete?
    <Button onClick={() => setConfirmPostDelete(!confirmPostDelete)}>
    <DeleteOutline/>
</Button>:null
}
        </div>
        <Dialog open={likesUser} onClose={()=>setLikesUser(!likesUser)}>
            <div className="DialogBox">
                <Typography varient="h4">
                    Liked By
                </Typography>
                {
                    likes.map(like=>(
                        <User
                        key={like._id}
                        userId={like._id}
                        name={like.name}
                        avatar={like.avatar.url}
                                                />
                    ))
                }
            </div>
        </Dialog>

        <Dialog open={commentToggle} onClose={()=>setCommentToggle(!commentToggle)}>
            <div className="DialogBox">
                <Typography varient="h4">
                    Comments
                </Typography>

                <form className="commentForm" onSubmit={addCommentHandler}>
                <input
                        type="text"
                        value={commentValue}
                        onChange={(e)=> setCommentValue(e.target.value)}
                        placeholder="Comment Here ..."
                        required
                        />
                        <Button type="submit"variant="contained">
                        Add
                        </Button>
                                        </form>

                {comments.length> 0 ? comments.map((item)=>(
                    <CommentCard 
                    userId={item.user._id}
                    name={item.user.name}
                    avatar={item.user.avatar.url}
                    comment={item.comment}
                    commentId={item._id}
                    key={item._id}
                    postId={postId}
                    isAccount={isAccount}
                    />
                )): <Typography>No Comments Yet</Typography>
                }
            </div>
        </Dialog>


        <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Update Caption</Typography>

          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here..."
              required
            />

            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>

              {/* confirm post delte */}
              <Dialog 
        open={confirmPostDelete}
        onClose={() => setConfirmPostDelete(!confirmPostDelete)}>
          <div className="confirmbox">
          <Typography className="texttype">
            Are you sure you want to Delete this Post?
          </Typography>
         <div className="btn">
         <Button onClick={() => setConfirmPostDelete(!confirmPostDelete)} className="btnCancel"> Cancel </Button>
          <Button onClick={deletePostHandler} className="btnYes">Yes</Button>
         </div>
          
          </div>
        </Dialog>
        </div>
  )
}

export default Post