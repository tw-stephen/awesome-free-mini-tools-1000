import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

// Emoji data with categories
const EMOJI_DATA: { emoji: string; name: string; keywords: string[]; category: string }[] = [
  // Smileys & Emotion
  { emoji: '😀', name: 'grinning face', keywords: ['happy', 'smile', 'joy'], category: 'smileys' },
  { emoji: '😃', name: 'grinning with big eyes', keywords: ['happy', 'smile', 'joy'], category: 'smileys' },
  { emoji: '😄', name: 'grinning with smiling eyes', keywords: ['happy', 'smile', 'joy'], category: 'smileys' },
  { emoji: '😁', name: 'beaming with smiling eyes', keywords: ['happy', 'grin'], category: 'smileys' },
  { emoji: '😅', name: 'grinning with sweat', keywords: ['nervous', 'relief'], category: 'smileys' },
  { emoji: '😂', name: 'face with tears of joy', keywords: ['laugh', 'funny', 'lol'], category: 'smileys' },
  { emoji: '🤣', name: 'rolling on floor laughing', keywords: ['laugh', 'rofl', 'lmao'], category: 'smileys' },
  { emoji: '😊', name: 'smiling with smiling eyes', keywords: ['happy', 'blush'], category: 'smileys' },
  { emoji: '😇', name: 'smiling with halo', keywords: ['angel', 'innocent'], category: 'smileys' },
  { emoji: '🙂', name: 'slightly smiling', keywords: ['happy', 'ok'], category: 'smileys' },
  { emoji: '🙃', name: 'upside-down', keywords: ['silly', 'sarcasm'], category: 'smileys' },
  { emoji: '😉', name: 'winking', keywords: ['wink', 'flirt'], category: 'smileys' },
  { emoji: '😌', name: 'relieved', keywords: ['calm', 'peace'], category: 'smileys' },
  { emoji: '😍', name: 'heart eyes', keywords: ['love', 'crush'], category: 'smileys' },
  { emoji: '🥰', name: 'smiling with hearts', keywords: ['love', 'adore'], category: 'smileys' },
  { emoji: '😘', name: 'blowing kiss', keywords: ['kiss', 'love'], category: 'smileys' },
  { emoji: '😗', name: 'kissing', keywords: ['kiss'], category: 'smileys' },
  { emoji: '😚', name: 'kissing closed eyes', keywords: ['kiss'], category: 'smileys' },
  { emoji: '😋', name: 'savoring food', keywords: ['yum', 'delicious'], category: 'smileys' },
  { emoji: '😛', name: 'tongue out', keywords: ['silly', 'playful'], category: 'smileys' },
  { emoji: '😜', name: 'winking with tongue', keywords: ['silly', 'crazy'], category: 'smileys' },
  { emoji: '🤪', name: 'zany', keywords: ['crazy', 'wild'], category: 'smileys' },
  { emoji: '😝', name: 'squinting with tongue', keywords: ['silly', 'playful'], category: 'smileys' },
  { emoji: '🤑', name: 'money-mouth', keywords: ['money', 'rich'], category: 'smileys' },
  { emoji: '🤗', name: 'hugging', keywords: ['hug', 'embrace'], category: 'smileys' },
  { emoji: '🤭', name: 'hand over mouth', keywords: ['oops', 'giggle'], category: 'smileys' },
  { emoji: '🤫', name: 'shushing', keywords: ['quiet', 'secret'], category: 'smileys' },
  { emoji: '🤔', name: 'thinking', keywords: ['think', 'hmm'], category: 'smileys' },
  { emoji: '🤐', name: 'zipper-mouth', keywords: ['secret', 'quiet'], category: 'smileys' },
  { emoji: '🤨', name: 'raised eyebrow', keywords: ['skeptical', 'doubt'], category: 'smileys' },
  { emoji: '😐', name: 'neutral', keywords: ['meh', 'indifferent'], category: 'smileys' },
  { emoji: '😑', name: 'expressionless', keywords: ['blank', 'unamused'], category: 'smileys' },
  { emoji: '😶', name: 'no mouth', keywords: ['speechless', 'silent'], category: 'smileys' },
  { emoji: '😏', name: 'smirking', keywords: ['smug', 'flirt'], category: 'smileys' },
  { emoji: '😒', name: 'unamused', keywords: ['bored', 'meh'], category: 'smileys' },
  { emoji: '🙄', name: 'rolling eyes', keywords: ['annoyed', 'whatever'], category: 'smileys' },
  { emoji: '😬', name: 'grimacing', keywords: ['awkward', 'nervous'], category: 'smileys' },
  { emoji: '😮‍💨', name: 'exhaling', keywords: ['sigh', 'relief'], category: 'smileys' },
  { emoji: '🤥', name: 'lying', keywords: ['lie', 'pinocchio'], category: 'smileys' },
  { emoji: '😔', name: 'pensive', keywords: ['sad', 'thoughtful'], category: 'smileys' },
  { emoji: '😪', name: 'sleepy', keywords: ['tired', 'sleep'], category: 'smileys' },
  { emoji: '🤤', name: 'drooling', keywords: ['hungry', 'want'], category: 'smileys' },
  { emoji: '😴', name: 'sleeping', keywords: ['sleep', 'zzz'], category: 'smileys' },
  { emoji: '😷', name: 'mask', keywords: ['sick', 'covid'], category: 'smileys' },
  { emoji: '🤒', name: 'thermometer', keywords: ['sick', 'fever'], category: 'smileys' },
  { emoji: '🤕', name: 'bandage', keywords: ['hurt', 'injured'], category: 'smileys' },
  { emoji: '🤢', name: 'nauseated', keywords: ['sick', 'gross'], category: 'smileys' },
  { emoji: '🤮', name: 'vomiting', keywords: ['sick', 'puke'], category: 'smileys' },
  { emoji: '😵', name: 'dizzy', keywords: ['confused', 'stunned'], category: 'smileys' },
  { emoji: '🤯', name: 'exploding head', keywords: ['mind blown', 'shocked'], category: 'smileys' },
  { emoji: '🥳', name: 'partying', keywords: ['party', 'celebrate'], category: 'smileys' },
  { emoji: '🥸', name: 'disguised', keywords: ['incognito', 'glasses'], category: 'smileys' },
  { emoji: '😎', name: 'cool', keywords: ['sunglasses', 'awesome'], category: 'smileys' },
  { emoji: '🤓', name: 'nerd', keywords: ['geek', 'smart'], category: 'smileys' },
  { emoji: '🧐', name: 'monocle', keywords: ['curious', 'inspect'], category: 'smileys' },
  { emoji: '😕', name: 'confused', keywords: ['puzzled', 'unsure'], category: 'smileys' },
  { emoji: '😟', name: 'worried', keywords: ['concerned', 'anxious'], category: 'smileys' },
  { emoji: '🙁', name: 'slightly frowning', keywords: ['sad', 'disappointed'], category: 'smileys' },
  { emoji: '☹️', name: 'frowning', keywords: ['sad', 'unhappy'], category: 'smileys' },
  { emoji: '😮', name: 'open mouth', keywords: ['surprised', 'wow'], category: 'smileys' },
  { emoji: '😯', name: 'hushed', keywords: ['surprised', 'quiet'], category: 'smileys' },
  { emoji: '😲', name: 'astonished', keywords: ['shocked', 'amazed'], category: 'smileys' },
  { emoji: '😳', name: 'flushed', keywords: ['embarrassed', 'shy'], category: 'smileys' },
  { emoji: '🥺', name: 'pleading', keywords: ['puppy eyes', 'please'], category: 'smileys' },
  { emoji: '😦', name: 'frowning open mouth', keywords: ['aw', 'sad'], category: 'smileys' },
  { emoji: '😧', name: 'anguished', keywords: ['distressed', 'sad'], category: 'smileys' },
  { emoji: '😨', name: 'fearful', keywords: ['scared', 'afraid'], category: 'smileys' },
  { emoji: '😰', name: 'anxious with sweat', keywords: ['nervous', 'worried'], category: 'smileys' },
  { emoji: '😥', name: 'sad but relieved', keywords: ['disappointed', 'phew'], category: 'smileys' },
  { emoji: '😢', name: 'crying', keywords: ['sad', 'tear'], category: 'smileys' },
  { emoji: '😭', name: 'loudly crying', keywords: ['sob', 'sad'], category: 'smileys' },
  { emoji: '😱', name: 'screaming in fear', keywords: ['shocked', 'scared'], category: 'smileys' },
  { emoji: '😖', name: 'confounded', keywords: ['frustrated', 'upset'], category: 'smileys' },
  { emoji: '😣', name: 'persevering', keywords: ['struggling', 'trying'], category: 'smileys' },
  { emoji: '😞', name: 'disappointed', keywords: ['sad', 'let down'], category: 'smileys' },
  { emoji: '😓', name: 'downcast with sweat', keywords: ['stressed', 'hard work'], category: 'smileys' },
  { emoji: '😩', name: 'weary', keywords: ['tired', 'exhausted'], category: 'smileys' },
  { emoji: '😫', name: 'tired', keywords: ['exhausted', 'fed up'], category: 'smileys' },
  { emoji: '🥱', name: 'yawning', keywords: ['tired', 'bored'], category: 'smileys' },
  { emoji: '😤', name: 'huffing', keywords: ['angry', 'frustrated'], category: 'smileys' },
  { emoji: '😡', name: 'pouting', keywords: ['angry', 'mad'], category: 'smileys' },
  { emoji: '😠', name: 'angry', keywords: ['mad', 'grumpy'], category: 'smileys' },
  { emoji: '🤬', name: 'cursing', keywords: ['swearing', 'angry'], category: 'smileys' },
  { emoji: '😈', name: 'smiling devil', keywords: ['evil', 'mischief'], category: 'smileys' },
  { emoji: '👿', name: 'angry devil', keywords: ['evil', 'angry'], category: 'smileys' },
  { emoji: '💀', name: 'skull', keywords: ['dead', 'death'], category: 'smileys' },
  { emoji: '☠️', name: 'skull and crossbones', keywords: ['death', 'danger'], category: 'smileys' },
  { emoji: '💩', name: 'poop', keywords: ['poo', 'crap'], category: 'smileys' },
  { emoji: '🤡', name: 'clown', keywords: ['circus', 'joker'], category: 'smileys' },
  { emoji: '👹', name: 'ogre', keywords: ['monster', 'demon'], category: 'smileys' },
  { emoji: '👺', name: 'goblin', keywords: ['tengu', 'monster'], category: 'smileys' },
  { emoji: '👻', name: 'ghost', keywords: ['boo', 'halloween'], category: 'smileys' },
  { emoji: '👽', name: 'alien', keywords: ['ufo', 'space'], category: 'smileys' },
  { emoji: '👾', name: 'alien monster', keywords: ['game', 'space invaders'], category: 'smileys' },
  { emoji: '🤖', name: 'robot', keywords: ['bot', 'ai'], category: 'smileys' },
  { emoji: '😺', name: 'smiling cat', keywords: ['cat', 'happy'], category: 'smileys' },
  { emoji: '😸', name: 'grinning cat', keywords: ['cat', 'smile'], category: 'smileys' },
  { emoji: '😹', name: 'cat with tears of joy', keywords: ['cat', 'laugh'], category: 'smileys' },
  { emoji: '😻', name: 'cat with heart eyes', keywords: ['cat', 'love'], category: 'smileys' },
  { emoji: '😼', name: 'smirking cat', keywords: ['cat', 'smug'], category: 'smileys' },
  { emoji: '😽', name: 'kissing cat', keywords: ['cat', 'kiss'], category: 'smileys' },
  { emoji: '🙀', name: 'weary cat', keywords: ['cat', 'shocked'], category: 'smileys' },
  { emoji: '😿', name: 'crying cat', keywords: ['cat', 'sad'], category: 'smileys' },
  { emoji: '😾', name: 'pouting cat', keywords: ['cat', 'angry'], category: 'smileys' },
  // Gestures
  { emoji: '👋', name: 'waving hand', keywords: ['hello', 'bye', 'wave'], category: 'gestures' },
  { emoji: '🤚', name: 'raised back of hand', keywords: ['stop', 'hand'], category: 'gestures' },
  { emoji: '🖐️', name: 'hand with fingers splayed', keywords: ['high five', 'stop'], category: 'gestures' },
  { emoji: '✋', name: 'raised hand', keywords: ['stop', 'high five'], category: 'gestures' },
  { emoji: '🖖', name: 'vulcan salute', keywords: ['spock', 'star trek'], category: 'gestures' },
  { emoji: '👌', name: 'ok hand', keywords: ['perfect', 'ok'], category: 'gestures' },
  { emoji: '🤌', name: 'pinched fingers', keywords: ['italian', 'chef kiss'], category: 'gestures' },
  { emoji: '🤏', name: 'pinching hand', keywords: ['small', 'tiny'], category: 'gestures' },
  { emoji: '✌️', name: 'victory hand', keywords: ['peace', 'v'], category: 'gestures' },
  { emoji: '🤞', name: 'crossed fingers', keywords: ['luck', 'hope'], category: 'gestures' },
  { emoji: '🤟', name: 'love-you gesture', keywords: ['love', 'rock'], category: 'gestures' },
  { emoji: '🤘', name: 'sign of the horns', keywords: ['rock', 'metal'], category: 'gestures' },
  { emoji: '🤙', name: 'call me hand', keywords: ['hang loose', 'shaka'], category: 'gestures' },
  { emoji: '👈', name: 'pointing left', keywords: ['left', 'point'], category: 'gestures' },
  { emoji: '👉', name: 'pointing right', keywords: ['right', 'point'], category: 'gestures' },
  { emoji: '👆', name: 'pointing up', keywords: ['up', 'point'], category: 'gestures' },
  { emoji: '🖕', name: 'middle finger', keywords: ['rude', 'flip off'], category: 'gestures' },
  { emoji: '👇', name: 'pointing down', keywords: ['down', 'point'], category: 'gestures' },
  { emoji: '☝️', name: 'index pointing up', keywords: ['one', 'point'], category: 'gestures' },
  { emoji: '👍', name: 'thumbs up', keywords: ['like', 'good', 'approve'], category: 'gestures' },
  { emoji: '👎', name: 'thumbs down', keywords: ['dislike', 'bad'], category: 'gestures' },
  { emoji: '✊', name: 'raised fist', keywords: ['solidarity', 'punch'], category: 'gestures' },
  { emoji: '👊', name: 'oncoming fist', keywords: ['punch', 'fist bump'], category: 'gestures' },
  { emoji: '🤛', name: 'left-facing fist', keywords: ['fist bump', 'punch'], category: 'gestures' },
  { emoji: '🤜', name: 'right-facing fist', keywords: ['fist bump', 'punch'], category: 'gestures' },
  { emoji: '👏', name: 'clapping hands', keywords: ['applause', 'bravo'], category: 'gestures' },
  { emoji: '🙌', name: 'raising hands', keywords: ['celebration', 'hooray'], category: 'gestures' },
  { emoji: '👐', name: 'open hands', keywords: ['jazz hands', 'hug'], category: 'gestures' },
  { emoji: '🤲', name: 'palms up together', keywords: ['prayer', 'cupped hands'], category: 'gestures' },
  { emoji: '🤝', name: 'handshake', keywords: ['deal', 'agree'], category: 'gestures' },
  { emoji: '🙏', name: 'folded hands', keywords: ['please', 'pray', 'thank you'], category: 'gestures' },
  { emoji: '✍️', name: 'writing hand', keywords: ['write', 'author'], category: 'gestures' },
  { emoji: '💪', name: 'flexed biceps', keywords: ['strong', 'muscle', 'power'], category: 'gestures' },
  // Hearts & Symbols
  { emoji: '❤️', name: 'red heart', keywords: ['love', 'heart'], category: 'hearts' },
  { emoji: '🧡', name: 'orange heart', keywords: ['love', 'heart'], category: 'hearts' },
  { emoji: '💛', name: 'yellow heart', keywords: ['love', 'friendship'], category: 'hearts' },
  { emoji: '💚', name: 'green heart', keywords: ['love', 'jealous'], category: 'hearts' },
  { emoji: '💙', name: 'blue heart', keywords: ['love', 'trust'], category: 'hearts' },
  { emoji: '💜', name: 'purple heart', keywords: ['love', 'sensitive'], category: 'hearts' },
  { emoji: '🖤', name: 'black heart', keywords: ['dark', 'sorrow'], category: 'hearts' },
  { emoji: '🤍', name: 'white heart', keywords: ['pure', 'love'], category: 'hearts' },
  { emoji: '🤎', name: 'brown heart', keywords: ['love', 'nature'], category: 'hearts' },
  { emoji: '💔', name: 'broken heart', keywords: ['heartbreak', 'sad'], category: 'hearts' },
  { emoji: '❣️', name: 'heart exclamation', keywords: ['love', 'emphasis'], category: 'hearts' },
  { emoji: '💕', name: 'two hearts', keywords: ['love', 'couple'], category: 'hearts' },
  { emoji: '💞', name: 'revolving hearts', keywords: ['love', 'romance'], category: 'hearts' },
  { emoji: '💓', name: 'beating heart', keywords: ['love', 'heartbeat'], category: 'hearts' },
  { emoji: '💗', name: 'growing heart', keywords: ['love', 'excited'], category: 'hearts' },
  { emoji: '💖', name: 'sparkling heart', keywords: ['love', 'romance'], category: 'hearts' },
  { emoji: '💘', name: 'heart with arrow', keywords: ['love', 'cupid'], category: 'hearts' },
  { emoji: '💝', name: 'heart with ribbon', keywords: ['love', 'gift'], category: 'hearts' },
  { emoji: '💟', name: 'heart decoration', keywords: ['love', 'cute'], category: 'hearts' },
  { emoji: '⭐', name: 'star', keywords: ['favorite', 'rating'], category: 'hearts' },
  { emoji: '🌟', name: 'glowing star', keywords: ['shining', 'awesome'], category: 'hearts' },
  { emoji: '✨', name: 'sparkles', keywords: ['magic', 'clean', 'shiny'], category: 'hearts' },
  { emoji: '💫', name: 'dizzy', keywords: ['star', 'shooting star'], category: 'hearts' },
  { emoji: '🔥', name: 'fire', keywords: ['hot', 'lit', 'flame'], category: 'hearts' },
  { emoji: '💥', name: 'collision', keywords: ['boom', 'explosion'], category: 'hearts' },
  { emoji: '💢', name: 'anger symbol', keywords: ['angry', 'vein'], category: 'hearts' },
  { emoji: '💦', name: 'sweat droplets', keywords: ['water', 'work'], category: 'hearts' },
  { emoji: '💨', name: 'dashing away', keywords: ['running', 'wind'], category: 'hearts' },
  { emoji: '🕳️', name: 'hole', keywords: ['black hole', 'empty'], category: 'hearts' },
  { emoji: '💣', name: 'bomb', keywords: ['explosive', 'danger'], category: 'hearts' },
  { emoji: '💬', name: 'speech balloon', keywords: ['chat', 'talk'], category: 'hearts' },
  { emoji: '💭', name: 'thought balloon', keywords: ['think', 'idea'], category: 'hearts' },
  { emoji: '💤', name: 'zzz', keywords: ['sleep', 'tired'], category: 'hearts' },
  // Animals & Nature
  { emoji: '🐶', name: 'dog face', keywords: ['puppy', 'pet'], category: 'animals' },
  { emoji: '🐱', name: 'cat face', keywords: ['kitty', 'pet'], category: 'animals' },
  { emoji: '🐭', name: 'mouse face', keywords: ['mouse', 'rodent'], category: 'animals' },
  { emoji: '🐹', name: 'hamster', keywords: ['pet', 'cute'], category: 'animals' },
  { emoji: '🐰', name: 'rabbit face', keywords: ['bunny', 'pet'], category: 'animals' },
  { emoji: '🦊', name: 'fox', keywords: ['clever', 'sly'], category: 'animals' },
  { emoji: '🐻', name: 'bear', keywords: ['teddy', 'cute'], category: 'animals' },
  { emoji: '🐼', name: 'panda', keywords: ['cute', 'china'], category: 'animals' },
  { emoji: '🐨', name: 'koala', keywords: ['australia', 'cute'], category: 'animals' },
  { emoji: '🐯', name: 'tiger face', keywords: ['fierce', 'cat'], category: 'animals' },
  { emoji: '🦁', name: 'lion', keywords: ['king', 'fierce'], category: 'animals' },
  { emoji: '🐮', name: 'cow face', keywords: ['moo', 'farm'], category: 'animals' },
  { emoji: '🐷', name: 'pig face', keywords: ['oink', 'farm'], category: 'animals' },
  { emoji: '🐸', name: 'frog', keywords: ['ribbit', 'amphibian'], category: 'animals' },
  { emoji: '🐵', name: 'monkey face', keywords: ['ape', 'primate'], category: 'animals' },
  { emoji: '🙈', name: 'see-no-evil monkey', keywords: ['monkey', 'shy'], category: 'animals' },
  { emoji: '🙉', name: 'hear-no-evil monkey', keywords: ['monkey', 'ignore'], category: 'animals' },
  { emoji: '🙊', name: 'speak-no-evil monkey', keywords: ['monkey', 'secret'], category: 'animals' },
  { emoji: '🐔', name: 'chicken', keywords: ['hen', 'bird'], category: 'animals' },
  { emoji: '🐧', name: 'penguin', keywords: ['bird', 'cold'], category: 'animals' },
  { emoji: '🐦', name: 'bird', keywords: ['tweet', 'fly'], category: 'animals' },
  { emoji: '🐤', name: 'baby chick', keywords: ['bird', 'cute'], category: 'animals' },
  { emoji: '🦆', name: 'duck', keywords: ['quack', 'bird'], category: 'animals' },
  { emoji: '🦅', name: 'eagle', keywords: ['bird', 'freedom'], category: 'animals' },
  { emoji: '🦉', name: 'owl', keywords: ['bird', 'wise'], category: 'animals' },
  { emoji: '🦇', name: 'bat', keywords: ['vampire', 'night'], category: 'animals' },
  { emoji: '🐺', name: 'wolf', keywords: ['howl', 'wild'], category: 'animals' },
  { emoji: '🐗', name: 'boar', keywords: ['pig', 'wild'], category: 'animals' },
  { emoji: '🐴', name: 'horse face', keywords: ['pony', 'ride'], category: 'animals' },
  { emoji: '🦄', name: 'unicorn', keywords: ['magic', 'fantasy'], category: 'animals' },
  { emoji: '🐝', name: 'honeybee', keywords: ['bee', 'sting'], category: 'animals' },
  { emoji: '🐛', name: 'bug', keywords: ['insect', 'caterpillar'], category: 'animals' },
  { emoji: '🦋', name: 'butterfly', keywords: ['insect', 'beautiful'], category: 'animals' },
  { emoji: '🐌', name: 'snail', keywords: ['slow', 'shell'], category: 'animals' },
  { emoji: '🐞', name: 'ladybug', keywords: ['insect', 'luck'], category: 'animals' },
  { emoji: '🐜', name: 'ant', keywords: ['insect', 'colony'], category: 'animals' },
  { emoji: '🦂', name: 'scorpion', keywords: ['sting', 'desert'], category: 'animals' },
  { emoji: '🐢', name: 'turtle', keywords: ['slow', 'shell'], category: 'animals' },
  { emoji: '🐍', name: 'snake', keywords: ['slither', 'reptile'], category: 'animals' },
  { emoji: '🦎', name: 'lizard', keywords: ['reptile', 'gecko'], category: 'animals' },
  { emoji: '🐙', name: 'octopus', keywords: ['tentacle', 'ocean'], category: 'animals' },
  { emoji: '🦑', name: 'squid', keywords: ['ocean', 'sea'], category: 'animals' },
  { emoji: '🦐', name: 'shrimp', keywords: ['seafood', 'ocean'], category: 'animals' },
  { emoji: '🦞', name: 'lobster', keywords: ['seafood', 'ocean'], category: 'animals' },
  { emoji: '🦀', name: 'crab', keywords: ['seafood', 'ocean'], category: 'animals' },
  { emoji: '🐡', name: 'blowfish', keywords: ['fish', 'ocean'], category: 'animals' },
  { emoji: '🐠', name: 'tropical fish', keywords: ['fish', 'ocean'], category: 'animals' },
  { emoji: '🐟', name: 'fish', keywords: ['ocean', 'swim'], category: 'animals' },
  { emoji: '🐬', name: 'dolphin', keywords: ['ocean', 'smart'], category: 'animals' },
  { emoji: '🐳', name: 'spouting whale', keywords: ['ocean', 'big'], category: 'animals' },
  { emoji: '🐋', name: 'whale', keywords: ['ocean', 'large'], category: 'animals' },
  { emoji: '🦈', name: 'shark', keywords: ['ocean', 'danger'], category: 'animals' },
  { emoji: '🐊', name: 'crocodile', keywords: ['alligator', 'reptile'], category: 'animals' },
  { emoji: '🐅', name: 'tiger', keywords: ['cat', 'fierce'], category: 'animals' },
  { emoji: '🐆', name: 'leopard', keywords: ['cat', 'spots'], category: 'animals' },
  { emoji: '🦓', name: 'zebra', keywords: ['stripes', 'horse'], category: 'animals' },
  { emoji: '🦍', name: 'gorilla', keywords: ['ape', 'strong'], category: 'animals' },
  { emoji: '🦧', name: 'orangutan', keywords: ['ape', 'primate'], category: 'animals' },
  { emoji: '🐘', name: 'elephant', keywords: ['large', 'trunk'], category: 'animals' },
  { emoji: '🦛', name: 'hippopotamus', keywords: ['hippo', 'large'], category: 'animals' },
  { emoji: '🦏', name: 'rhinoceros', keywords: ['horn', 'large'], category: 'animals' },
  { emoji: '🐪', name: 'camel', keywords: ['desert', 'hump'], category: 'animals' },
  { emoji: '🐫', name: 'two-hump camel', keywords: ['desert', 'bactrian'], category: 'animals' },
  { emoji: '🦒', name: 'giraffe', keywords: ['tall', 'neck'], category: 'animals' },
  { emoji: '🦘', name: 'kangaroo', keywords: ['australia', 'hop'], category: 'animals' },
  // Food & Drink
  { emoji: '🍎', name: 'red apple', keywords: ['fruit', 'healthy'], category: 'food' },
  { emoji: '🍐', name: 'pear', keywords: ['fruit', 'green'], category: 'food' },
  { emoji: '🍊', name: 'orange', keywords: ['fruit', 'citrus'], category: 'food' },
  { emoji: '🍋', name: 'lemon', keywords: ['fruit', 'sour'], category: 'food' },
  { emoji: '🍌', name: 'banana', keywords: ['fruit', 'yellow'], category: 'food' },
  { emoji: '🍉', name: 'watermelon', keywords: ['fruit', 'summer'], category: 'food' },
  { emoji: '🍇', name: 'grapes', keywords: ['fruit', 'wine'], category: 'food' },
  { emoji: '🍓', name: 'strawberry', keywords: ['fruit', 'berry'], category: 'food' },
  { emoji: '🍒', name: 'cherries', keywords: ['fruit', 'red'], category: 'food' },
  { emoji: '🍑', name: 'peach', keywords: ['fruit', 'butt'], category: 'food' },
  { emoji: '🥭', name: 'mango', keywords: ['fruit', 'tropical'], category: 'food' },
  { emoji: '🍍', name: 'pineapple', keywords: ['fruit', 'tropical'], category: 'food' },
  { emoji: '🥥', name: 'coconut', keywords: ['tropical', 'nut'], category: 'food' },
  { emoji: '🥝', name: 'kiwi', keywords: ['fruit', 'green'], category: 'food' },
  { emoji: '🍅', name: 'tomato', keywords: ['vegetable', 'red'], category: 'food' },
  { emoji: '🍆', name: 'eggplant', keywords: ['vegetable', 'purple'], category: 'food' },
  { emoji: '🥑', name: 'avocado', keywords: ['vegetable', 'healthy'], category: 'food' },
  { emoji: '🥦', name: 'broccoli', keywords: ['vegetable', 'green'], category: 'food' },
  { emoji: '🥬', name: 'leafy green', keywords: ['vegetable', 'lettuce'], category: 'food' },
  { emoji: '🥒', name: 'cucumber', keywords: ['vegetable', 'green'], category: 'food' },
  { emoji: '🌶️', name: 'hot pepper', keywords: ['spicy', 'chili'], category: 'food' },
  { emoji: '🌽', name: 'corn', keywords: ['vegetable', 'yellow'], category: 'food' },
  { emoji: '🥕', name: 'carrot', keywords: ['vegetable', 'orange'], category: 'food' },
  { emoji: '🧅', name: 'onion', keywords: ['vegetable', 'cooking'], category: 'food' },
  { emoji: '🧄', name: 'garlic', keywords: ['vegetable', 'cooking'], category: 'food' },
  { emoji: '🥔', name: 'potato', keywords: ['vegetable', 'carbs'], category: 'food' },
  { emoji: '🍞', name: 'bread', keywords: ['carbs', 'bakery'], category: 'food' },
  { emoji: '🥐', name: 'croissant', keywords: ['french', 'bakery'], category: 'food' },
  { emoji: '🥖', name: 'baguette', keywords: ['french', 'bread'], category: 'food' },
  { emoji: '🧀', name: 'cheese', keywords: ['dairy', 'yellow'], category: 'food' },
  { emoji: '🥚', name: 'egg', keywords: ['breakfast', 'protein'], category: 'food' },
  { emoji: '🍳', name: 'cooking', keywords: ['breakfast', 'fried egg'], category: 'food' },
  { emoji: '🥓', name: 'bacon', keywords: ['breakfast', 'meat'], category: 'food' },
  { emoji: '🥩', name: 'steak', keywords: ['meat', 'beef'], category: 'food' },
  { emoji: '🍗', name: 'poultry leg', keywords: ['chicken', 'meat'], category: 'food' },
  { emoji: '🍖', name: 'meat on bone', keywords: ['bbq', 'food'], category: 'food' },
  { emoji: '🌭', name: 'hot dog', keywords: ['sausage', 'fast food'], category: 'food' },
  { emoji: '🍔', name: 'hamburger', keywords: ['burger', 'fast food'], category: 'food' },
  { emoji: '🍟', name: 'french fries', keywords: ['fries', 'fast food'], category: 'food' },
  { emoji: '🍕', name: 'pizza', keywords: ['italian', 'food'], category: 'food' },
  { emoji: '🥪', name: 'sandwich', keywords: ['lunch', 'bread'], category: 'food' },
  { emoji: '🌮', name: 'taco', keywords: ['mexican', 'food'], category: 'food' },
  { emoji: '🌯', name: 'burrito', keywords: ['mexican', 'wrap'], category: 'food' },
  { emoji: '🥗', name: 'salad', keywords: ['healthy', 'vegetable'], category: 'food' },
  { emoji: '🍜', name: 'noodle', keywords: ['ramen', 'asian'], category: 'food' },
  { emoji: '🍝', name: 'spaghetti', keywords: ['pasta', 'italian'], category: 'food' },
  { emoji: '🍣', name: 'sushi', keywords: ['japanese', 'fish'], category: 'food' },
  { emoji: '🍱', name: 'bento', keywords: ['japanese', 'lunch'], category: 'food' },
  { emoji: '🍛', name: 'curry', keywords: ['indian', 'rice'], category: 'food' },
  { emoji: '🍲', name: 'pot of food', keywords: ['stew', 'soup'], category: 'food' },
  { emoji: '🍚', name: 'cooked rice', keywords: ['asian', 'bowl'], category: 'food' },
  { emoji: '🍿', name: 'popcorn', keywords: ['movie', 'snack'], category: 'food' },
  { emoji: '🧁', name: 'cupcake', keywords: ['dessert', 'sweet'], category: 'food' },
  { emoji: '🎂', name: 'birthday cake', keywords: ['birthday', 'dessert'], category: 'food' },
  { emoji: '🍰', name: 'shortcake', keywords: ['dessert', 'sweet'], category: 'food' },
  { emoji: '🍩', name: 'doughnut', keywords: ['donut', 'sweet'], category: 'food' },
  { emoji: '🍪', name: 'cookie', keywords: ['sweet', 'biscuit'], category: 'food' },
  { emoji: '🍫', name: 'chocolate bar', keywords: ['candy', 'sweet'], category: 'food' },
  { emoji: '🍬', name: 'candy', keywords: ['sweet', 'sugar'], category: 'food' },
  { emoji: '🍭', name: 'lollipop', keywords: ['candy', 'sweet'], category: 'food' },
  { emoji: '🍮', name: 'custard', keywords: ['dessert', 'pudding'], category: 'food' },
  { emoji: '🍦', name: 'ice cream', keywords: ['dessert', 'cold'], category: 'food' },
  { emoji: '☕', name: 'coffee', keywords: ['hot', 'caffeine'], category: 'food' },
  { emoji: '🍵', name: 'tea', keywords: ['hot', 'drink'], category: 'food' },
  { emoji: '🧃', name: 'juice box', keywords: ['drink', 'fruit'], category: 'food' },
  { emoji: '🥤', name: 'cup with straw', keywords: ['soda', 'drink'], category: 'food' },
  { emoji: '🍺', name: 'beer', keywords: ['alcohol', 'drink'], category: 'food' },
  { emoji: '🍻', name: 'clinking beer mugs', keywords: ['cheers', 'alcohol'], category: 'food' },
  { emoji: '🥂', name: 'clinking glasses', keywords: ['cheers', 'champagne'], category: 'food' },
  { emoji: '🍷', name: 'wine glass', keywords: ['alcohol', 'drink'], category: 'food' },
  { emoji: '🥃', name: 'tumbler glass', keywords: ['whiskey', 'alcohol'], category: 'food' },
  { emoji: '🍸', name: 'cocktail glass', keywords: ['martini', 'alcohol'], category: 'food' },
  { emoji: '🧊', name: 'ice', keywords: ['cold', 'frozen'], category: 'food' },
  // Objects
  { emoji: '⌚', name: 'watch', keywords: ['time', 'clock'], category: 'objects' },
  { emoji: '📱', name: 'mobile phone', keywords: ['phone', 'iphone'], category: 'objects' },
  { emoji: '💻', name: 'laptop', keywords: ['computer', 'mac'], category: 'objects' },
  { emoji: '⌨️', name: 'keyboard', keywords: ['type', 'computer'], category: 'objects' },
  { emoji: '🖥️', name: 'desktop computer', keywords: ['pc', 'mac'], category: 'objects' },
  { emoji: '🖱️', name: 'computer mouse', keywords: ['click', 'computer'], category: 'objects' },
  { emoji: '💽', name: 'computer disk', keywords: ['storage', 'cd'], category: 'objects' },
  { emoji: '💾', name: 'floppy disk', keywords: ['save', 'storage'], category: 'objects' },
  { emoji: '💿', name: 'optical disk', keywords: ['cd', 'dvd'], category: 'objects' },
  { emoji: '📀', name: 'dvd', keywords: ['movie', 'disc'], category: 'objects' },
  { emoji: '📷', name: 'camera', keywords: ['photo', 'picture'], category: 'objects' },
  { emoji: '📹', name: 'video camera', keywords: ['video', 'record'], category: 'objects' },
  { emoji: '🎥', name: 'movie camera', keywords: ['film', 'cinema'], category: 'objects' },
  { emoji: '📞', name: 'telephone', keywords: ['call', 'phone'], category: 'objects' },
  { emoji: '📺', name: 'television', keywords: ['tv', 'screen'], category: 'objects' },
  { emoji: '📻', name: 'radio', keywords: ['music', 'broadcast'], category: 'objects' },
  { emoji: '🎧', name: 'headphone', keywords: ['music', 'audio'], category: 'objects' },
  { emoji: '🎤', name: 'microphone', keywords: ['sing', 'karaoke'], category: 'objects' },
  { emoji: '🎬', name: 'clapper board', keywords: ['movie', 'film'], category: 'objects' },
  { emoji: '🔋', name: 'battery', keywords: ['power', 'energy'], category: 'objects' },
  { emoji: '🔌', name: 'electric plug', keywords: ['power', 'electricity'], category: 'objects' },
  { emoji: '💡', name: 'light bulb', keywords: ['idea', 'electricity'], category: 'objects' },
  { emoji: '🔦', name: 'flashlight', keywords: ['light', 'torch'], category: 'objects' },
  { emoji: '📚', name: 'books', keywords: ['read', 'library'], category: 'objects' },
  { emoji: '📖', name: 'open book', keywords: ['read', 'literature'], category: 'objects' },
  { emoji: '📝', name: 'memo', keywords: ['note', 'write'], category: 'objects' },
  { emoji: '✏️', name: 'pencil', keywords: ['write', 'draw'], category: 'objects' },
  { emoji: '🖊️', name: 'pen', keywords: ['write', 'ink'], category: 'objects' },
  { emoji: '📎', name: 'paperclip', keywords: ['attach', 'office'], category: 'objects' },
  { emoji: '📌', name: 'pushpin', keywords: ['pin', 'location'], category: 'objects' },
  { emoji: '✂️', name: 'scissors', keywords: ['cut', 'tool'], category: 'objects' },
  { emoji: '📦', name: 'package', keywords: ['box', 'delivery'], category: 'objects' },
  { emoji: '🎁', name: 'gift', keywords: ['present', 'birthday'], category: 'objects' },
  { emoji: '🔑', name: 'key', keywords: ['lock', 'security'], category: 'objects' },
  { emoji: '🔒', name: 'locked', keywords: ['security', 'padlock'], category: 'objects' },
  { emoji: '🔓', name: 'unlocked', keywords: ['open', 'security'], category: 'objects' },
]

const CATEGORIES = ['all', 'smileys', 'gestures', 'hearts', 'animals', 'food', 'objects']

export default function EmojiFinder() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const { copy } = useClipboard()
  const [copiedEmoji, setCopiedEmoji] = useState('')

  const filteredEmojis = useMemo(() => {
    return EMOJI_DATA.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category
      const searchLower = search.toLowerCase()
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(searchLower) ||
        item.keywords.some((k) => k.toLowerCase().includes(searchLower))
      return matchesCategory && matchesSearch
    })
  }, [search, category])

  const handleCopy = (emoji: string) => {
    copy(emoji)
    setCopiedEmoji(emoji)
    setTimeout(() => setCopiedEmoji(''), 1500)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('tools.emojiFinder.searchPlaceholder')}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 text-sm rounded ${category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t(`tools.emojiFinder.categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-500">
            {filteredEmojis.length} {t('tools.emojiFinder.results')}
          </span>
          {copiedEmoji && (
            <span className="text-sm text-green-600">
              {copiedEmoji} {t('common.copied')}
            </span>
          )}
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1">
          {filteredEmojis.map((item, i) => (
            <button
              key={i}
              onClick={() => handleCopy(item.emoji)}
              title={item.name}
              className="p-2 text-2xl hover:bg-slate-100 rounded transition-colors"
            >
              {item.emoji}
            </button>
          ))}
        </div>
        {filteredEmojis.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            {t('tools.emojiFinder.noResults')}
          </div>
        )}
      </div>
    </div>
  )
}
