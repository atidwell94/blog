import { createContext, useState, useCallback } from "react";
import axios from 'axios';

const PostsContext = createContext();

function Provider({ children }) {
// USESTATES---------------------------------------------------------------
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);

// FETCHING----------------------------------------------------------------
    const fetchFeaturedPosts = useCallback(async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts?_expand=user&_sort=datetime&_order=desc&_start=0&_end=12`);
        setFeaturedPosts(response.data);
    }, []);

    const fetchCategories = useCallback(async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/categories?_sort=name&_order=asc`);
        setCategories(response.data);
    }, []);

    const fetchPosts = useCallback(async (userId) => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts?userId=$%7b${userId}%7d&_expand=user&_sort=datetime&_order=desc`);
        setPosts(response.data);
    }, []);

    // MODIFYING---------------------------------------------------------------
    const deletePostById = async (id) => {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts?_expand=user&_sort=datetime&_order=desc&_start=0&_end=12`);
        const updatedPosts = posts.filter((post) => {
            return post.id !== id;
        });
        setPosts(updatedPosts);
    };

    const editPostById = async (id, newValues) => {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/posts?_expand=user&_sort=datetime&_order=desc&_start=0&_end=12`, newValues);
        const updatedPosts = posts.map((post) => {
            if (post.id === id) {
                return { ...post, ...response.data };
            }
            return post;
        });
        setPosts(updatedPosts);
    };

    const createPost = async (values, userId) => {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/posts?userId=$%7b${userId}%7d&_expand=user&_sort=datetime&_order=desc`, values);
        const updatedPosts = [...posts, response.data];
        setPosts(updatedPosts);
    };

    const valueToShare = {
        featuredPosts,
        categories,
        posts,
        fetchFeaturedPosts,
        fetchCategories,
        fetchPosts,
        deletePostById,
        editPostById,
        createPost
    };

    return <PostsContext.Provider value={valueToShare}>
        {children}
    </PostsContext.Provider>
}

export { Provider };
export default PostsContext;