// Array of all selected quotes
const quotes = [
    { text: "The purpose of life is to live it, to taste experience to the utmost, to reach out eagerly and without fear for newer and richer experience.", author: "Eleanor Roosevelt" },
    { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
    { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { text: "Every man dies. Not every man really lives.", author: "William Wallace" },
    { text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.", author: "Mark Twain" },
    { text: "Dost thou love life? Then do not squander time, for that is the stuff life is made of.", author: "Benjamin Franklin" },
    { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
    { text: "The proper function of man is to live, not to exist. I shall not waste my days in trying to prolong them. I shall use my time.", author: "Jack London" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "A man who dares to waste one hour of time has not discovered the value of life.", author: "Charles Darwin" },
    { text: "Tell me, what is it you plan to do with your one wild and precious life?", author: "Mary Oliver" },
    { text: "The tragedy of life is not death but what we let die inside of us while we live.", author: "Norman Cousins" },
    { text: "Believe that life is worth living and your belief will help create the fact.", author: "William James" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "Don't let the fear of striking out hold you back.", author: "Babe Ruth" },
    { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
    { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali" }
];

// Pick a random quote
const randomIndex = Math.floor(Math.random() * quotes.length);
const selectedQuote = quotes[randomIndex];

// Wait for the DOM to load before trying to inject text
document.addEventListener('DOMContentLoaded', () => {
    // Inject the text and author into the HTML
    document.getElementById('quote-text').textContent = `"${selectedQuote.text}"`;
    document.getElementById('quote-author').textContent = `— ${selectedQuote.author}`;

    // Close tab functionality
    document.getElementById('close-tab-btn').addEventListener('click', () => {
        window.close();
    });
});