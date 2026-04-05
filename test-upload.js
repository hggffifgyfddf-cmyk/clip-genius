import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config({ path: ".env" })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  const res = await supabase.storage
    .from("clipgenius")
    .upload("test.txt", Buffer.from("hello world"), {
      contentType: "text/plain",
    })

  console.log(res)
}

test()