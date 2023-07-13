import tap from "tap";
import { compareStrings } from "../helpers/compareStrings.js"

tap.test("test case insensitivity function that comparing two strings all in uppercase", t => {
  t.ok(compareStrings("ORLANDO", "Orlando"), "handles all uppercase")
  t.ok(compareStrings("orlando", "Orlando"), "handles all lowercase")
  t.ok(compareStrings("OrlAnDo", "Orlando"), "handles possible case typos")
  t.ok(compareStrings("new york", "New York"), "handles multiple words")
  t.ok(compareStrings("the wicked witch Of The west", "The Wicked Witch of the West"), "handles prepositions")
  t.end()
})
