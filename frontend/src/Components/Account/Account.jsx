import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React,{useEffect,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMyProfile, getMyPosts, loadUser, logoutUser } from '../../Actions/User';
import Loader from '../Loader/Loader';
import Post from '../Post/Post';
import "./Account.css";
import {Link} from "react-router-dom";
import User from "../User/User";
import { useAlert } from 'react-alert';

const Account = () => {
    
    const dispatch = useDispatch();
    const alert = useAlert();
    const { user, loading: userLoading } = useSelector((state) => state.user);
const{loading,posts,error} = useSelector((state)=>state.myPosts);
const {error:likeError, message, loading:deleteLoading} = useSelector((state)=> state.like);

const [followersToggle, setFollowersToggle] = useState(false);

const [followingToggle, setFollowingToggle] = useState(false);

const [profileDelete, setProfileDelete] = useState(false);

const [confirmLogout, setConfirmLogout] = useState(false);

useEffect(()=>{
  dispatch (getMyPosts());
  dispatch(loadUser());

},[dispatch]);


  useEffect(()=>{
    if(error){
      alert.error(error);
     dispatch({type:"clearErrors"});
   }
    if(likeError){
      alert.error(likeError);
     dispatch({type:"clearErrors"});
   }
   if(message){
      alert.success(message);
     dispatch({type:"clearMessage"});
   }
  },[alert,error,message,likeError,dispatch]);

const deleteProfileHandler = async () => {
    await dispatch(deleteMyProfile());
    dispatch(logoutUser());
  };
const logoutHandler= async()=>{
   await dispatch(logoutUser());
   alert.success("logged out successfully")
}



  return loading === true || userLoading === true ?(
      <Loader/>
  ):(
    <div className='account'>
        <div className="accountleft">
        {
        posts && posts.length > 0? posts.map((post)=>(
    <Post
    key={post._id}
    postId={post._id}
    caption={post.caption}
    postImage={post.image.url}
    likes={post.likes}
    comments={post.comments}   
    ownerImage={post.owner.avatar.url}
    ownerName={post.owner.name}
    ownerId={post.owner._id}
    isAccount={true}
    isDelete={true}
    />
  )): <Typography variant="h6">You have not made any post</Typography>
}
        </div>
        <div className="accountright">
        <Avatar
          src={user.avatar.url}
          sx={{ height: "8vmax", width: "8vmax" }}
        />

        <Typography variant="h5">{user.name}</Typography>


        <div>
            <button onClick={() => setFollowersToggle(!followersToggle)}>
            <Typography>Followers</Typography>
            </button>
            <Typography>
                {user.followers.length}
            </Typography>
        </div>

        <div>
            <button onClick={() => setFollowingToggle(!followingToggle)}>
            <Typography>Following</Typography>
            </button>
            <Typography>
                {user.following.length}
            </Typography>
        </div>

        <div>
            
            <Typography>Posts</Typography>
            <Typography>
                {user.posts.length}
            </Typography>
        </div>

        <Button variant="contained" onClick={() => setConfirmLogout(!confirmLogout)}>
          Logout
        </Button>

        <Link to="/update/profile">Edit Profile</Link>
        <Link to="/update/password">Change Password</Link>

        <Button
          variant="text"
          style={{ color: "red", margin: "2vmax" }}
          onClick={() => setProfileDelete(!profileDelete)}
          disabled={deleteLoading}
        >
          Delete My Profile
        </Button>

        <Dialog
          open={followersToggle}
          onClose={() => setFollowersToggle(!followersToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>

            {user && user.followers.length > 0 ? (
              user.followers.map((follower) => (
                <User
                  key={follower._id}
                  userId={follower._id}
                  name={follower.name}
                  avatar={follower.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                You have no followers
              </Typography>
            )}
          </div>
        </Dialog>

        <Dialog
          open={followingToggle}
          onClose={() => setFollowingToggle(!followingToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Following</Typography>

            {user && user.following.length > 0 ? (
              user.following.map((follow) => (
                <User
                  key={follow._id}
                  userId={follow._id}
                  name={follow.name}
                  avatar={follow.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                You're not following anyone
              </Typography>
            )}
          </div>
        </Dialog>

        {/* //confirm delete Profile */}
        <Dialog 
        open={profileDelete}
        onClose={() => setProfileDelete(!profileDelete)}>
          <div className="confirmbox">
          <Typography className="texttype">
            Are you sure you want to delete your Profile?
          </Typography>
         <div className="btn">
         <Button onClick={() => setProfileDelete(!profileDelete)} className="btnCancel"> Cancel </Button>
          <Button onClick={deleteProfileHandler} className="btnYes">Yes</Button>
         </div>
          
          </div>
        </Dialog>

        {/* confirm logout */}
         <Dialog 
        open={confirmLogout}
        onClose={() => setConfirmLogout(!confirmLogout)}>
          <div className="confirmbox">
          <Typography className="texttype">
            Are you sure you want to Logout
          </Typography>
         <div className="btn">
         <Button onClick={() => setConfirmLogout(!confirmLogout)} className="btnCancel"> Cancel </Button>
          <Button onClick={logoutHandler} className="btnYes">Yes</Button>
         </div>
          
          </div>
        </Dialog>

        </div>
    </div>
  )
}

export default Account