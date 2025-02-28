// Original interface.
interface Post {
  id: number
  title: string
}

// Extended interface.
interface NewPost extends Omit<Post, "id"> {
  id?: number
  content: string | null
}

// Object using NewPost interface.
const test: NewPost = {
  title: "This is a test title.",
  content:
    "This is some test content. Notice how the 'id' property is not required.",
}
