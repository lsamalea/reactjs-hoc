import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import { CommentsDataSource, BlogPostDataSource } from './DataSource';
import { map, unless, isNil, range, last, pipe, flip, prop, addIndex, concat, times } from 'ramda';
import * as R from 'ramda';
import { ErrorBoundary } from './ErrorBoundary';
import { withSubscription } from './hoc/withSubscription';

const TextBlock = ({ content }) => <p>TextBlock: {content} </p>;
const Comment = ({ text }) => <><span>Comment: {text} </span> <hr /></>;

// class CommentList extends Component {
//   constructor(props) {
//     super(props);
//     this.handleCommentsDataChange = this.handleCommentsDataChange.bind(this);
//     this.state = {
//       comments : CommentsDataSource.getData()
//     };
//   }
//   componentDidMount() {
//     CommentsDataSource.addChangeListener(this.handleCommentsDataChange);
//   }

//   componentWillUnmount() {
//     CommentsDataSource.removeChangeListener(this.handleCommentsDataChange);
//   }

//   handleCommentsDataChange(comments) {
//     console.log('handleDataChange');
//     this.setState((state) => ({
//       ...state,
//       comments
//     }));
//   }

//   render() {
//     const { comments } = this.state;
//     const createCommentsView = (comment) => (
//       <Comment data={comment} key={comment.id}></Comment>
//     );
//     const mapCommentsToView = unless(isNil, map(createCommentsView));
//     return (
//       <div>
//         {mapCommentsToView(comments)}
//       </div>
//     )
//   }
// }

// class BlogPost extends Component {
//   constructor(props) {
//     super(props);
//     this.handleBlogPostDataChange = this.handleBlogPostDataChange.bind(this);
//     this.state = {
//       blogPost: BlogPostDataSource.getItemById(props.id)
//     };
//   }
//   componentDidMount() {
//     BlogPostDataSource.addChangeListener(this.handleBlogPostDataChange);
//   }

//   componentWillUnmount() {
//     BlogPostDataSource.removeChangeListener(this.handleBlogPostDataChange);
//   }

//   handleBlogPostDataChange() {
//     const blogPost = BlogPostDataSource.getItemById(this.props.id)
//     this.setState((state) => ({
//       ...state,
//       blogPost
//     }));
//   }

//   render() {
//     const { blogPost } = this.state;
//     return <TextBlock content={blogPost && blogPost.content} />
//   }
// }

// class BlogPost extends Component {
//   constructor(props) {
//     super(props);
//     this.handleBlogPostDataChange = this.handleBlogPostDataChange.bind(this);
//     this.state = {
//       blogPost: BlogPostDataSource.getItemById(props.id)
//     };
//   }
//   componentDidMount() {
//     BlogPostDataSource.addChangeListener(this.handleBlogPostDataChange);
//   }

//   componentWillUnmount() {
//     BlogPostDataSource.removeChangeListener(this.handleBlogPostDataChange);
//   }

//   handleBlogPostDataChange() {
//     const blogPost = BlogPostDataSource.getItemById(this.props.id)
//     this.setState((state) => ({
//       ...state,
//       blogPost
//     }));
//   }

//   render() {
//     const { blogPost } = this.state;
//     return <TextBlock content={blogPost && blogPost.content} />
//   }
// }


const BlogPost = withSubscription(
  class extends Component { render() { const { data } = this.props; return <TextBlock content={data && data.content} /> } },
  BlogPostDataSource,
  (DataSource, { id }) => DataSource.getItemById(id)
)

const CommentList = withSubscription(
  class extends Component {
    render() {
      if (this.props && this.props.data) {
        const comments = this.props.data;
        const createCommentsView = (comment) => (
          <Comment text={comment.text} key={comment.id}></Comment>
        );
        const mapCommentsToView = unless(isNil, map(createCommentsView));
        return (
          <div>
            {mapCommentsToView(comments)}
          </div>
        )
      }

      return null;
    }
  },
  CommentsDataSource,
  (DataSource, { id }) => DataSource.getData()
);

const createComment = (id) => ({ id, text: `some comment - id ${id}` });
const appendFrom = (create, fromId, count, list) =>
  pipe(
    // create indexes
    R.times(R.add(fromId)),
    // create new items based on indexes
    map(create),
    // concat with original list
    concat(list)
  )(count);
const appendTenComments = (fromId, list) => appendFrom(createComment, fromId, 10, list);
class App extends Component {
  constructor() {
    super();    
    const comments = appendTenComments(0, []),
    const blogPosts = [{ id: 1, content: 'some blog text' }]
    BlogPostDataSource.setData(blogPosts);
    CommentsDataSource.setData(comments);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {    
    const comments = CommentsDataSource.getData();
    const getLatestId = pipe(last, prop('id'));
    const lastestCommentId = getLatestId(comments);
    const newComments =  appendTenComments(lastestCommentId + 1, comments);
    CommentsDataSource.setData(newComments);
  }

  render() {
    return (
      <>
        <button onClick={this.handleClick}>load more data</button>
        <ErrorBoundary>
          <BlogPost id={1} />
        </ErrorBoundary>
        <ErrorBoundary>
          <CommentList />
        </ErrorBoundary>
      </>
    );
  }
}

render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('root'));
