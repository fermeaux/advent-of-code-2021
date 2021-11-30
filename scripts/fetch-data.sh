printf -v day "%02d" $1
mkdir -p ./src/solutions
mkdir -p ./src/solutions/aoc-$day
curl --cookie "session=$AOC_SESSION_ID" https://adventofcode.com/2021/day/$1/input --output ./src/solutions/aoc-$day/data.txt